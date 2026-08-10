import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { CreateNoteInput } from "../types/noteTypes.js";
import { successResponse, errorResponse } from "../../utils/httpResponse.js";
import { noteService } from "../../../shared/dependencies.js";

export async function createNoteHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return errorResponse(400, "Bad Request", "Missing body in request");
  }

  try {
    const parseBody = JSON.parse(event.body);

    if (
      typeof parseBody !== "object" ||
      parseBody === null ||
      !("title" in parseBody) ||
      !("content" in parseBody)
    ) {
      return errorResponse(
        400,
        "Bad Request",
        "Request body must contain valid title and content",
      );
    }

    const title = parseBody.title;
    const content = parseBody.content;

    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      typeof content !== "string"
    ) {
      return errorResponse(
        400,
        "Bad Request",
        "title and content must be strings, and title cannot be empty",
      );
    }

    const note: CreateNoteInput = {
      title,
      content,
    };

    const createdNote = await noteService.createNote(note);

    return successResponse(201, createdNote);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse(
        400,
        "Bad Request",
        "Request body must contain valid JSON",
      );
    }

    console.log("createNoteHandler error: ", error);

    return errorResponse(
      500,
      "Internal Server Error",
      "An unexpected error occurred",
    );
  }
}
