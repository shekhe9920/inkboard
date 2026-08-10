import type { Note } from "../notes/types/noteTypes.js";

export function successResponse(statusCode: number, data: Note | Note[]) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data,
    }),
  };
}

export function errorResponse(statusCode: number, err: string, msg: string) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      error: err,
      message: msg,
    }),
  };
}
