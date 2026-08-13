import type { APIGatewayProxyResult } from "aws-lambda";

export async function heathHandler(): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "ok",
      uploadedAt: new Date().toISOString,
    }),
  };
}
