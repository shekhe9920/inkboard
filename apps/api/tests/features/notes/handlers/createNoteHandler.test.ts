import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockApiGatewayEvent } from "../../../helpers/mockApiGatewayEvent";

const { createNoteMock } = vi.hoisted(() => ({
  createNoteMock: vi.fn(),
}));

vi.mock("../../../../src/shared/dependencies", () => ({
  noteService: {
    createNote: createNoteMock,
  },
}));

import { createNoteHandler } from "../../../../src/features/notes/handlers/createNoteHandler";
import { noteService } from "../../../../src/shared/dependencies";
import type { Note } from "../../../../src/features/notes/types/noteTypes";

describe("createNoteHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 201 when a new note is created", async () => {
    const fakeNote: Note = {
      id: "123",
      title: "Test",
      content: "Hello",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };
    vi.mocked(noteService.createNote).mockResolvedValue(fakeNote);

    const mockEvent = createMockApiGatewayEvent({
      body: JSON.stringify({
        title: "Test",
        content: "Hello",
      }),
    });

    const response = await createNoteHandler(mockEvent);
    const body = JSON.parse(response.body);

    expect(noteService.createNote).toHaveBeenCalledOnce();
    expect(noteService.createNote).toHaveBeenCalledWith({
      title: "Test",
      content: "Hello",
    });
    expect(response.statusCode).toBe(201);
    expect(body.data).toEqual({
      id: "123",
      title: "Test",
      content: "Hello",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    });
  });

  it("should return 400 if body is missing", async () => {
    const mockEvent = createMockApiGatewayEvent();

    const response = await createNoteHandler(mockEvent);

    expect(response).toEqual({
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "Missing body in request",
      }),
    });
  });

  it("should return 400 if parsed body is null", async () => {
    const mockEvent = createMockApiGatewayEvent({
      body: "null",
    });

    const response = await createNoteHandler(mockEvent);

    expect(response).toEqual({
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "Request body must contain valid title and content",
      }),
    });
  });

  it("should return 400 when title is not a string", async () => {
    const mockEvent = createMockApiGatewayEvent({
      body: JSON.stringify({
        title: 123,
        content: "Hello",
      }),
    });
    const response = await createNoteHandler(mockEvent);

    expect(noteService.createNote).not.toHaveBeenCalled();
    expect(response).toEqual({
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "title and content must be strings",
      }),
    });
  });

  it("should return 400 when there is syntax error", async () => {
    const mockEvent = createMockApiGatewayEvent({
      body: '{"title": "Test", "content": }',
    });

    const response = await createNoteHandler(mockEvent);

    expect(response).toEqual({
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "Request body must contain valid JSON",
      }),
    });
  });

  it("should catch exception when createNoteHandler throws error", async () => {
    vi.mocked(noteService.createNote).mockRejectedValue(
      new Error("Database failed"),
    );

    const mockEvent = createMockApiGatewayEvent({
      body: JSON.stringify({
        title: "Test",
        content: "Hello",
      }),
    });

    const response = await createNoteHandler(mockEvent);

    expect(response).toEqual({
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
      }),
    });
  });
});
