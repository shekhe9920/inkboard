import type { NoteRepository } from "./noteRepository.js";
import type { Note } from "../types/noteTypes.js";

export class InMemoryNoteRepository implements NoteRepository {
  private notes: Note[] = [];

  async save(note: Note): Promise<Note> {
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
}
