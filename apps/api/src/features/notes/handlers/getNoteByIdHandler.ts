import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { successResponse, errorResponse } from "../../utils/httpResponse.js";
import { noteService } from "../../../shared/dependencies.js";

export async function getNoteByIdHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return errorResponse(400, "Bad Request", "Missing note id in path");
    }

    const note = await noteService.findNoteById(id);
    if (!note) {
      return errorResponse(
        404,
        "Not Found",
        `Note with id='${id}' was not found`,
      );
    }

    return successResponse(200, note);
  } catch (error) {
    console.log("getNoteByIdHandler error: ", error);

    return errorResponse(
      500,
      "Internal Server Error",
      "An unexpected error occurred",
    );
  }
}
