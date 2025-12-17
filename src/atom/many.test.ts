import { test, expect } from "bun:test"
import * as parser from "@src"

const INPUT : parser.definition.Input = {
    data: "AAC",
    cursor: 0
}

const ERROR = "ERROR" as const

test("parser.atom.Many collects results until the inner parser errors", () => {
    const parse = new parser.atom.Many(
        new parser.atom.Try(
            new parser.atom.Predicate(
                new parser.atom.Character(),
                (x) => x == "A"
                    ? { success: true }
                    : { success: false, error: ERROR }
            )
        )
    )

    const result = parse.parse(INPUT)
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual(["A", "A"])
    expect(result.input.cursor).toEqual(2)
})

test("parser.atom.Many errors if the inner parser errors and consumes input", () => {
    const parse = new parser.atom.Many(
        new parser.atom.Predicate(
            new parser.atom.Character(),
            (x) => x == "A"
                ? { success: true }
                : { success: false, error: ERROR }
        )
    )

    const result = parse.parse(INPUT)
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.error).toEqual(ERROR)
    expect(result.input.cursor).toEqual(3)
})

test("parser.atom.Many throws if the inner parser succeeds without consuming input", () => {
    const parse = new parser.atom.Many(
        new parser.atom.Value("A")
    )

    expect(() => parse.parse(INPUT)).toThrow(
        parser.atom.many.ERROR_MSG
    )
})
