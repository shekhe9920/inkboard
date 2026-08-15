import { describe, it, expect, vi, beforeEach } from "vitest";

const { getAllNotesMock } = vi.hoisted(() => ({
  getAllNotesMock: vi.fn(),
}));

vi.mock("../../../../src/shared/dependencies", () => ({
  noteService: {
    getAllNotes: getAllNotesMock,
  },
}));

import { getAllNotesHandler } from "../../../../src/features/notes/handlers/getAllNotesHandler";
import { noteService } from "../../../../src/shared/dependencies";
import type { Note } from "../../../../src/features/notes/types/noteTypes";

describe("getAllNotesHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully return all notes", async () => {
    const fakeNote1: Note = {
      id: "0001",
      title: "Test-1",
      content: "Hello-1",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    const fakeNote2: Note = {
      id: "0002",
      title: "Test-2",
      content: "Hello-2",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    const notes: Note[] = [fakeNote1, fakeNote2];

    vi.mocked(noteService.getAllNotes).mockResolvedValue(notes);

    const response = await getAllNotesHandler();
    const body = JSON.parse(response.body);

    expect(noteService.getAllNotes).toHaveBeenCalledOnce();

    expect(response.statusCode).toBe(200);
    expect(body).toEqual({
      data: [
        {
          id: "0001",
          title: "Test-1",
          content: "Hello-1",
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
        {
          id: "0002",
          title: "Test-2",
          content: "Hello-2",
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      ],
    });
  });

  it("should return an empty list if there is no notes", async () => {
    vi.mocked(noteService.getAllNotes).mockResolvedValue([]);

    const response = await getAllNotesHandler();
    const body = JSON.parse(response.body);

    expect(noteService.getAllNotes).toHaveBeenCalledOnce();
    expect(response.statusCode).toBe(200);
    expect(body).toEqual({ data: [] });
  });

  it("should return 500 if getAllNotesHandler fails", async () => {
    vi.mocked(noteService.getAllNotes).mockRejectedValue(
      new Error("Database failed"),
    );

    const response = await getAllNotesHandler();
    const body = JSON.parse(response.body);

    expect(noteService.getAllNotes).toHaveBeenCalledOnce();
    expect(response.statusCode).toBe(500);
    expect(body).toEqual({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  });
});
