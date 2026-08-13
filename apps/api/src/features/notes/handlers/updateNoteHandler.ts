import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { UpdateNoteInput } from "../types/noteTypes.js";
import { successResponse, errorResponse } from "../../utils/httpResponse.js";
import { noteService } from "../../../shared/dependencies.js";

export async function updateNoteHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return errorResponse(400, "Bad Request", "Missing body in request");
  }

  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return errorResponse(400, "Bad Request", "Missing note id in path");
    }

    const parseBody = JSON.parse(event.body);

    if (typeof parseBody !== "object" || parseBody === null) {
      return errorResponse(
        400,
        "Bad Request",
        "Request body must contain valid title and content",
      );
    }

    const title = parseBody.title;
    const content = parseBody.content;

    if (title === undefined && content === undefined) {
      return errorResponse(
        400,
        "Bad Request",
        "At least one field must be provided",
      );
    }

    if (
      title !== undefined &&
      (typeof title !== "string" || title.trim() === "")
    ) {
      return errorResponse(
        400,
        "Bad Request",
        "title must be non-empty string",
      );
    }

    if (content !== undefined && typeof content !== "string") {
      return errorResponse(400, "Bad Request", "content must be a string");
    }

    const input: UpdateNoteInput = {
      title,
      content,
    };

    const updatedNote = await noteService.updateNote(id, input);
    if (!updatedNote) {
      return errorResponse(
        404,
        "Not Found",
        `Note with id='${id}' was not found`,
      );
    }

    return successResponse(200, updatedNote);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse(
        400,
        "Bad Request",
        "Request body must cotain valid json",
      );
    }

    console.log("updateNoteHandler error: ", error);

    return errorResponse(
      500,
      "Internal Server Error",
      "An unexpected error occurred",
    );
  }
}
