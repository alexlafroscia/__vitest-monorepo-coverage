import { test, expect } from "vitest";
import { addAndDouble } from "./add-and-double";

test("addAndDouble", () => {
  expect(addAndDouble(2, 3)).toBe(10);
});
