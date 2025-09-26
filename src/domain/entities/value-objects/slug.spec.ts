import { expect, test } from "vitest";
import { Slug } from "./slug.js";

test("it should create a slug from a string", () => {
    const slug = Slug.createFromText("Some Example Text!");

    expect(slug.value).toBe("some-example-text");
});