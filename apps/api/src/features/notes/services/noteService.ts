import type { Note, CreateNoteInput } from "../types/noteTypes.js";
import type { NoteRepository } from "../repository/noteRepository.js";
import { randomUUID } from "node:crypto";

export class NoteService {
  private repository: NoteRepository;

  constructor(repository: NoteRepository) {
    this.repository = repository;
  }

  async createNote(input: CreateNoteInput): Promise<Note> {
    const now = new Date().toISOString();

    const note: Note = {
      id: randomUUID(),
      title: input.title,
      content: input.content,
      createdAt: now,
      updatedAt: now,
    };

    const savedNote = await this.repository.save(note);

    return savedNote;
  }

  async findNoteById(id: string): Promise<Note | undefined> {
    return this.repository.getById(id);
  }

  async getAllNotes(): Promise<Note[]> {
    return this.repository.getAll();
  }
}
