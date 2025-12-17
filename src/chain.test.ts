import { test, expect } from "bun:test"
import * as parser from "@src"

test("new parser.Chain() maps values", () => {
    const parse = new parser.Chain(new parser.atom.Character())
        .map.value((value) => value.toUpperCase())

    const result = parse.parse({ data: "abc", cursor: 0 })
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual("A")
    expect(result.input.cursor).toEqual(1)
})

test("new parser.Chain() maps errors", () => {
    const parse = new parser.Chain(new parser.atom.Character())
        .map.error((error) => error.errorType)

    const result = parse.parse({ data: "abc", cursor: 3 })
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.error).toEqual("ASTROPARSE::ATOM::CHARACTER::INPUT_END")
    expect(result.input.cursor).toEqual(3)
})

test("new parser.Chain() applies try and many", () => {
    const parse = new parser.Chain(
        new parser.atom.Predicate(
            new parser.atom.Character(),
            (value) => value === "a"
                ? { success: true }
                : { success: false, error: "not-a" }
        )
    )
        .try()
        .many()

    const result = parse.parse({ data: "aaab", cursor: 0 })
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual(["a", "a", "a"])
    expect(result.input.cursor).toEqual(3)
})

test("new parser.Chain() peeks without consuming input", () => {
    const parse = new parser.Chain(new parser.atom.Character()).peek()

    const result = parse.parse({ data: "abc", cursor: 0 })
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual("a")
    expect(result.input.cursor).toEqual(0)
})
