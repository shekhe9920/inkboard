import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { successResponse, errorResponse } from "../../utils/httpResponse.js";
import { noteService } from "../../../shared/dependencies.js";

export async function getAllNotesHandler(): Promise<APIGatewayProxyResult> {
  try {
    const notes = await noteService.getAllNotes();

    return successResponse(200, notes);
  } catch (error) {
    console.log("getAllNotesHandler error: ", error);

    return errorResponse(
      500,
      "Internal Server Error",
      "An unexpected error occurred",
    );
  }
}
