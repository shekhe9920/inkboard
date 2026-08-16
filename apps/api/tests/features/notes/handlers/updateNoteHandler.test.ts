import { describe, it, expect, vi, beforeEach } from "vitest";

const { updateNoteMock } = vi.hoisted(() => ({
  updateNoteMock: vi.fn(),
}));

vi.mock("../../../../src/shared/dependencies", () => ({
  noteService: {
    updateNote: updateNoteMock,
  },
}));

import { updateNoteHandler } from "../../../../src/features/notes/handlers/updateNoteHandler";
import { noteService } from "../../../../src/shared/dependencies";
import type { Note } from "../../../../src/features/notes/types/noteTypes";
import { createMockApiGatewayEvent } from "../../../helpers/mockApiGatewayEvent";

describe("updateNoteHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update note title and content successfully", async () => {
    const updatedFakeNote: Note = {
      id: "123",
      title: "New Title",
      content: "New content",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-02",
    };

    vi.mocked(noteService.updateNote).mockResolvedValue(updatedFakeNote);

    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        id: "123",
      },
      body: JSON.stringify({
        title: "New Title",
        content: "New content",
      }),
    });

    const response = await updateNoteHandler(mockEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(noteService.updateNote).toHaveBeenCalledWith("123", {
      title: "New Title",
      content: "New content",
    });
    expect(body.data).toEqual({
      id: "123",
      title: "New Title",
      content: "New content",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-02",
    });
  });

  it("should return 400 when body is missing in the request", async () => {
    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        id: "123",
      },
    });

    const response = await updateNoteHandler(mockEvent);
    const body = JSON.parse(response.body);

    expect(noteService.updateNote).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(400);
    expect(body).toEqual({
      error: "Bad Request",
      message: "Missing body in request",
    });
  });

  it("should return 400 if id is missing from the path parameter", async () => {
    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {},
      body: JSON.stringify({
        title: "New Title",
        content: "New content",
      }),
    });

    const response = await updateNoteHandler(mockEvent);
    const body = JSON.parse(response.body);

    expect(noteService.updateNote).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(400);
    expect(body).toEqual({
      error: "Bad Request",
      message: "Missing note id in path",
    });
  });

  it("should return 400 if body is null", async () => {
    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        id: "123",
      },
      body: "null",
    });

    const response = await updateNoteHandler(mockEvent);
    const body = JSON.parse(response.body);

    expect(noteService.updateNote).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(400);
    expect(body).toEqual({
      error: "Bad Request",
      message: "Request body must contain valid title and content",
    });
  });

  it("should return 400 if title and content is not defined", async () => {
    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        id: "123",
      },
      body: JSON.stringify({}),
    });

    const response = await updateNoteHandler(mockEvent);
    const body = JSON.parse(response.body);

    expect(noteService.updateNote).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(400);
    expect(body).toEqual({
      error: "Bad Request",
      message: "At least one field must be provided",
    });
  });

  it("should return 400 if title and content is not a string", async () => {
    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        id: "123",
      },
      body: JSON.stringify({
        title: null,
        content: null,
      }),
    });

    const response = await updateNoteHandler(mockEvent);
    const body = JSON.parse(response.body);

    expect(noteService.updateNote).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(400);
    expect(body).toEqual({
      error: "Bad Request",
      message: "title must be non-empty string",
    });
  });

  it("should return 404 if note with given id is not found", async () => {
    vi.mocked(noteService.updateNote).mockResolvedValue(undefined);

    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        id: "321",
      },
      body: JSON.stringify({
        title: "New Title",
        content: "New content",
      }),
    });

    const response = await updateNoteHandler(mockEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(404);
    expect(body).toEqual({
      error: "Not Found",
      message: `Note with id='321' was not found`,
    });
  });

  it("should return 400 when there is syntax error", async () => {
    const mockEvent = createMockApiGatewayEvent({
      pathParameters: { id: "123" },
      body: '{"title": "Test", "content": }',
    });

    const response = await updateNoteHandler(mockEvent);
    const body = JSON.parse(response.body);

    expect(noteService.updateNote).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(400);
    expect(body).toEqual({
      error: "Bad Request",
      message: "Request body must contain valid JSON",
    });
  });

  it("should catch exception when updateNoteHandler throws error", async () => {
    vi.mocked(noteService.updateNote).mockRejectedValue(
      new Error("Database failed"),
    );

    const mockEvent = createMockApiGatewayEvent({
      pathParameters: { id: "123" },
      body: JSON.stringify({
        title: "Test",
        content: "Hello",
      }),
    });

    const response = await updateNoteHandler(mockEvent);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(500);
    expect(body).toEqual({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  });
});
