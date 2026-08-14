import type {
  Note,
  CreateNoteInput,
  UpdateNoteInput,
} from "../types/noteTypes.js";
import type { NoteRepository } from "../repository/noteRepository.js";
import { randomUUID } from "node:crypto";
import { title } from "node:process";

export class NoteService {
  private repository: NoteRepository;

  constructor(repository: NoteRepository) {
    this.repository = repository;
  }

  async createNote(input: CreateNoteInput): Promise<Note> {
    const now = new Date().toISOString();

    let title = input.title;
    if (title === undefined || title.trim() === "") {
      title = "New Note";
    }

    const note: Note = {
      id: randomUUID(),
      title: title,
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

  async updateNote(
    id: string,
    item: UpdateNoteInput,
  ): Promise<Note | undefined> {
    return this.repository.update(id, item);
  }

  async deleteNoteById(id: string): Promise<Note | undefined> {
    return this.repository.deleteById(id);
  }
}
