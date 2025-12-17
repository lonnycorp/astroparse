import { test, expect } from "bun:test"
import * as parser from "@src"

const INPUT = { data: "ok", cursor: 0 }

test("parser.atom.Peek returns value without consuming input on success", () => {
    const peekCharacter = new parser.atom.Peek(new parser.atom.Character())
    const result = peekCharacter.parse(INPUT)
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual("o")
    expect(result.input.cursor).toEqual(0)
})

test("parser.atom.Peek returns error without consuming input on failure", () => {
    const alwaysFailPredicate = new parser.atom.Predicate(
        new parser.atom.Character(),
        () => ({ success: false, error: { errorType: "ALWAYS_FALSE" } })
    )
    const peekPredicate = new parser.atom.Peek(alwaysFailPredicate)

    const result = peekPredicate.parse(INPUT)
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.error).toEqual({ errorType: "ALWAYS_FALSE" })
    expect(result.input.cursor).toEqual(0)
})
