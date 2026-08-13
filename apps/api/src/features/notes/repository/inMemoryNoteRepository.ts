import type { NoteRepository } from "./noteRepository.js";
import type { Note, UpdateNoteInput } from "../types/noteTypes.js";

export class InMemoryNoteRepository implements NoteRepository {
  private notes: Note[] = [];

  async save(note: Note): Promise<Note> {
    if (!note.title) {
      note.title = "New Note";
    }
    this.notes.push(note);
    return note;
  }

  async getById(id: string): Promise<Note | undefined> {
    const result = this.notes.find((note) => note.id === id);

    return result;
  }

  async getAll(): Promise<Note[]> {
    return this.notes;
  }

  async update(id: string, input: UpdateNoteInput): Promise<Note | undefined> {
    const noteToUpdate = this.notes.find((note) => note.id === id);

    if (!noteToUpdate) {
      return undefined;
    }

    if (input.title !== undefined) {
      noteToUpdate.title = input.title;
    }

    if (input.content !== undefined) {
      noteToUpdate.content = input.content;
    }

    noteToUpdate.updatedAt = new Date().toISOString();

    return noteToUpdate;
  }

  async deleteById(id: string): Promise<Note | undefined> {
    const deletedNote = this.getById(id);
    this.notes = this.notes.filter((note) => note.id !== id);

    return deletedNote;
  }
}
