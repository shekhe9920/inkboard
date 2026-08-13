import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { successResponse, errorResponse } from "../../utils/httpResponse.js";
import { noteService } from "../../../shared/dependencies.js";

export async function deleteNoteByIdHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return errorResponse(400, "Bad Request", "Missing note id in path");
    }

    const deletedNote = await noteService.deleteNoteById(id);
    if (!deletedNote) {
      return errorResponse(
        404,
        "Not Found",
        `Note with id='${id}' was not found`,
      );
    }

    return successResponse(200, deletedNote);
  } catch (error) {
    console.log("deleteByIdHandler error: ", error);

    return errorResponse(
      500,
      "Internal Server Error",
      "An unexpected error occurred",
    );
  }
}
