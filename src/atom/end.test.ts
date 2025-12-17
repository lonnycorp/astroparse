import { test, expect } from "bun:test"
import * as parser from "@src"

test("new parser.atom.End() returns null when at the end of the input", () => {
    const result = new parser.atom.End().parse({ data: "hello", cursor: 5 })
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toBeNull()
    expect(result.input.cursor).toEqual(5)
})

test("new parser.atom.End() errors when not at the end of the input", () => {
    const result = new parser.atom.End().parse({ data: "hello", cursor: 0 })
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.error).toEqual({
        errorType: "ASTROPARSE::ATOM::END::INPUT_NOT_END"
    })

    expect(result.input.cursor).toEqual(0)
})
