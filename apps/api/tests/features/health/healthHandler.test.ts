import { describe, it, expect } from "vitest";
import { heathHandler } from "../../../src/features/health/healthHandler";

describe("Test Health Handler", () => {
  it("should return 200 ok", async () => {
    const res = await heathHandler();

    const bodyObject = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(res.headers).toEqual({
      "Content-Type": "application/json",
    });
    expect(bodyObject).toEqual({
      status: "ok",
    });
  });
});
