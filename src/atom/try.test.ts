import { test, expect } from "bun:test"
import * as parser from "@src"

const INPUT = { data: "hi", cursor: 0 }

test("parser.atom.Try returns inner success result and keeps input advance", () => {
    const tryCharacter = new parser.atom.Try(new parser.atom.Character())
    const result = tryCharacter.parse(INPUT)
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual("h")
    expect(result.input.cursor).toEqual(1)
})

test("parser.atom.Try rewinds input when wrapped parser fails", () => {
    const alwaysFailPredicate = new parser.atom.Predicate(
        new parser.atom.Character(),
        () => ({ success: false, error: { errorType: "ALWAYS_FALSE" } })
    )
    const tryPredicate = new parser.atom.Try(alwaysFailPredicate)

    const result = tryPredicate.parse(INPUT)
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.error).toEqual({ errorType: "ALWAYS_FALSE" })
    expect(result.input.cursor).toEqual(0)
})
