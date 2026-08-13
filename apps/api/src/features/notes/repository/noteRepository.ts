import type { Note, UpdateNoteInput } from "../types/noteTypes.js";

export interface NoteRepository {
  save(note: Note): Promise<Note>;

  getById(id: string): Promise<Note | undefined>;

  getAll(): Promise<Note[]>;

  update(id: string, input: UpdateNoteInput): Promise<Note | undefined>;

  deleteById(id: string): Promise<Note | undefined>;
}
