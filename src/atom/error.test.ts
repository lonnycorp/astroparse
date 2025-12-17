import { test, expect } from "bun:test"
import * as parser from "@src"

const INPUT : parser.definition.Input = {
    data: "hello world",
    cursor: 0,
}

test("parser.atom.Error returns an error without consuming input", () => {
    const parse = new parser.atom.Error("boom")
    const result = parse.parse(INPUT)

    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.input.cursor).toEqual(0)
    expect(result.error).toEqual("boom")
})
