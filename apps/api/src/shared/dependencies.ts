import { NoteService } from "../features/notes/services/noteService.js";
import { InMemoryNoteRepository } from "../features/notes/repository/inMemoryNoteRepository.js";

const repository = new InMemoryNoteRepository();
const noteService = new NoteService(repository);

export { noteService };
