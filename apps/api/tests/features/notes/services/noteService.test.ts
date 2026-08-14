import { describe, it, expect, beforeEach, vi } from "vitest";
import { NoteService } from "../../../../src/features/notes/services/noteService";
import { InMemoryNoteRepository } from "../../../../src/features/notes/repository/inMemoryNoteRepository";

let repository: InMemoryNoteRepository;
let service: NoteService;

describe("NoteService Test", () => {
  beforeEach(() => {
    repository = new InMemoryNoteRepository();
    service = new NoteService(repository);
  });

  it("should create a new note", async () => {
    const input = {
      title: "Test Note",
      content: "This is my test note",
    };

    const response = await service.createNote(input);

    expect(response.id).toBeDefined();
    expect(typeof response.id).toBe("string");

    expect(response.title).toBe("Test Note");
    expect(response.content).toBe("This is my test note");

    expect(response.createdAt).toBeDefined();
    expect(typeof response.createdAt).toBe("string");

    expect(response.updatedAt).toBeDefined();
    expect(typeof response.updatedAt).toBe("string");

    expect(response.updatedAt).toBe(response.createdAt);
  });

  it("should set title to 'New Note' when title is blank", async () => {
    const note = {
      title: "   ",
      content: "Hello",
    };

    const createdNote = await service.createNote(note);

    expect(createdNote.title).toBe("New Note");
  });

  it("should find note by id", async () => {
    const input = {
      title: "Test note",
      content: "This is my test note",
    };

    const testNote = await service.createNote(input);
    const id = testNote.id;
    const searchResult = await service.findNoteById(id);

    expect(testNote).toEqual(searchResult);
  });

  it("should return undefined if note by id is not found", async () => {
    const id = "non-existing-id";
    const searchResult = await service.findNoteById(id);

    expect(searchResult).toBeUndefined();
  });

  it("should return all notes", async () => {
    const input1 = { title: "1", content: "1" };
    const input2 = { title: "2", content: "2" };
    const input3 = { title: "3", content: "3" };

    await service.createNote(input1);
    await service.createNote(input2);
    await service.createNote(input3);

    const allNotes = await service.getAllNotes();

    expect(allNotes).toHaveLength(3);

    for (let i = 0; i < allNotes.length; i++) {
      expect(allNotes.at(i)?.title).toEqual((i + 1).toString());
      expect(allNotes.at(i)?.content).toEqual((i + 1).toString());
    }
  });

  it("should return empty list if there is no notes", async () => {
    const allNotes = await service.getAllNotes();
    expect(allNotes).toEqual([]);
  });

  it("should successfully update note title and content", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T10:00:00.000Z"));

    const input = {
      title: "Test note",
      content: "This is my test note",
    };

    const testNote = await service.createNote(input);

    // advance time by 1 sec
    vi.advanceTimersByTime(1000);

    const updatedNote = await service.updateNote(testNote.id, {
      title: "Updated Title",
      content: "THIS IS MY TEST NOTE!!",
    });

    expect(updatedNote?.title).toBe("Updated Title");
    expect(updatedNote?.content).toBe("THIS IS MY TEST NOTE!!");
    expect(updatedNote?.id).toBe(testNote.id);
    expect(updatedNote?.createdAt).toBe(testNote.createdAt);
    expect(updatedNote?.updatedAt).not.toEqual(testNote.createdAt);
  });

  it("should successfully update only title, partial-update", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T10:00:00.000Z"));

    const input = {
      title: "Old Test note",
      content: "Original content",
    };

    const testNote = await service.createNote(input);

    vi.advanceTimersByTime(1000);

    const updatedNote = await service.updateNote(testNote.id, {
      title: "Updated Title",
    });

    expect(updatedNote?.title).toBe("Updated Title");
    expect(updatedNote?.content).toBe("Original content");
    expect(updatedNote?.id).toBe(testNote.id);
    expect(updatedNote?.createdAt).toBe(testNote.createdAt);
    expect(updatedNote?.updatedAt).not.toEqual(testNote.createdAt);
  });

  it("should successfully update only content, partial-update", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T10:00:00.000Z"));

    const input = {
      title: "Original Title",
      content: "Original content",
    };

    const testNote = await service.createNote(input);

    vi.advanceTimersByTime(1000);

    const updatedNote = await service.updateNote(testNote.id, {
      content: "New Content",
    });

    expect(updatedNote?.title).toBe("Original Title");
    expect(updatedNote?.content).toBe("New Content");
    expect(updatedNote?.id).toBe(testNote.id);
    expect(updatedNote?.createdAt).toBe(testNote.createdAt);
    expect(updatedNote?.updatedAt).not.toBe(testNote.createdAt);
  });

  it("should successfully delete note", async () => {
    const input = {
      title: "Test Note",
      content: "This is my test note",
    };

    const response = await service.createNote(input);
    const deletedNote = await service.deleteNoteById(response.id);
    const remainingNotes = await service.getAllNotes();

    expect(deletedNote).toEqual(response);

    expect(remainingNotes).toHaveLength(0);
  });

  it("should return undefined if delete is called with unknown id", async () => {
    const deletedNote = await service.deleteNoteById("non-existing-id");

    expect(deletedNote).toBeUndefined();
  });
});
