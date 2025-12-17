import { test, expect } from "bun:test"
import * as parser from "@src"

const predicateIsA = new parser.atom.Predicate(
    new parser.atom.Character(),
    (value) => value === "a"
        ? { success: true }
        : { success: false, error: { errorType: "NOT_A" } }
)

test("parser.atom.Predicate propagates inner parser errors", () => {
    const result = predicateIsA.parse({ data: "a", cursor: 1 })
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.error).toEqual({ errorType: "ASTROPARSE::ATOM::CHARACTER::INPUT_END" })
    expect(result.input.cursor).toEqual(1)
})

test("parser.atom.Predicate returns value if predicate passes", () => {
    const result = predicateIsA.parse({ data: "ab", cursor: 0 })
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual("a")
    expect(result.input.cursor).toEqual(1)
})

test("parser.atom.Predicate returns error when predicate fails", () => {
    const result = predicateIsA.parse({ data: "cb", cursor: 0 })
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.error).toEqual({ errorType: "NOT_A" })
    expect(result.input.cursor).toEqual(1)
})
