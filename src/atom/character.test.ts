import { test, expect } from "bun:test"
import * as parser from "@src"

test("new parser.atom.Character() returns current character and advances input", () => {
    const result = new parser.atom.Character().parse({ data: "abc", cursor: 1 })
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual("b")
    expect(result.input.cursor).toEqual(2)
})

test("new parser.atom.Character() errors when at the end of the input", () => {
    const result = new parser.atom.Character().parse({ data: "abc", cursor: 3 }) as parser.definition.ResultError<
        parser.atom.character.ParseResultError
    >
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.error).toEqual({
        errorType: "ASTROPARSE::ATOM::CHARACTER::INPUT_END"
    })

    expect(result.input.cursor).toEqual(3)
})
