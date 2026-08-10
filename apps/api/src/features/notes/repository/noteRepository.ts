import type { Note } from "../types/noteTypes.js";

export interface NoteRepository {
  save(note: Note): Promise<Note>;

  getById(id: string): Promise<Note | undefined>;

  getAll(): Promise<Note[]>;
}
