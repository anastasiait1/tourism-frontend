import { describe, expect, it } from "vitest";
import { boundsToBbox } from "./boundsToBbox";

describe("boundsToBbox", () => {
  it("uses [longitude, latitude] and FastAPI bbox order", () => {
    expect(boundsToBbox([[23.1, 51.2], [28.9, 56.1]])).toBe("23.1,51.2,28.9,56.1");
  });

  it("rounds coordinates to six decimal places", () => {
    expect(boundsToBbox([[23.12345678, 51.2], [28.9, 56.1]])).toBe("23.123457,51.2,28.9,56.1");
  });

  it("rejects coordinates outside the allowed range", () => {
    expect(() => boundsToBbox([[181, 51], [28, 56]])).toThrow();
  });

  it("normalizes reversed bounds", () => {
    expect(boundsToBbox([[24, 56], [28, 51]])).toBe(
      "24,51,28,56",
    );
  });
});
