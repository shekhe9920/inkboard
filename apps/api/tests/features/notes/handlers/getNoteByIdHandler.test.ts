import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockApiGatewayEvent } from "../../../helpers/mockApiGatewayEvent";

const { findNoteByIdMock } = vi.hoisted(() => ({
  findNoteByIdMock: vi.fn(),
}));

vi.mock("../../../../src/shared/dependencies", () => ({
  noteService: {
    findNoteById: findNoteByIdMock,
  },
}));

import { getNoteByIdHandler } from "../../../../src/features/notes/handlers/getNoteByIdHandler";
import { noteService } from "../../../../src/shared/dependencies";
import type { Note } from "../../../../src/features/notes/types/noteTypes";

describe("getNoteByIdHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should find note by id", async () => {
    const fakeNote: Note = {
      id: "123",
      title: "Test",
      content: "Hello",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    vi.mocked(noteService.findNoteById).mockResolvedValue(fakeNote);
    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        id: "123",
      },
    });

    const response = await getNoteByIdHandler(mockEvent);

    expect(noteService.findNoteById).toHaveBeenCalledOnce();
    expect(noteService.findNoteById).toHaveBeenCalledWith("123");

    expect(response).toEqual({
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          id: "123",
          title: "Test",
          content: "Hello",
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      }),
    });
  });

  it("should return 400 if id is missing from path parameter", async () => {
    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {},
    });

    const response = await getNoteByIdHandler(mockEvent);

    expect(noteService.findNoteById).not.toHaveBeenCalled();
    expect(response).toEqual({
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "Missing note id in path",
      }),
    });
  });

  it("should return 404 if note with given id is not found", async () => {
    vi.mocked(noteService.findNoteById).mockResolvedValue(undefined);

    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        id: "321",
      },
    });

    const response = await getNoteByIdHandler(mockEvent);

    expect(noteService.findNoteById).toHaveBeenCalledWith("321");
    expect(noteService.findNoteById).toHaveBeenCalledOnce();
    expect(response).toEqual({
      statusCode: 404,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Not Found",
        message: `Note with id='321' was not found`,
      }),
    });
  });

  it("should catch exception when getNoteByIdHandler throws error", async () => {
    vi.mocked(noteService.findNoteById).mockRejectedValue(
      new Error("Database failed"),
    );

    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        id: "test",
      },
    });

    const response = await getNoteByIdHandler(mockEvent);

    expect(noteService.findNoteById).toHaveBeenCalledOnce();
    expect(noteService.findNoteById).toHaveBeenCalledWith("test");
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
