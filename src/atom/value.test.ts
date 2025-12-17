import { test, expect } from "bun:test"
import * as parser from "@src"

const INPUT : parser.definition.Input = {
    data: "hello world",
    cursor: 0,
}

const DEFINITION_INPUT : parser.definition.Input = INPUT

test("parser.atom.Value returns a value without consuming input", () => {
    const parse = new parser.atom.Value("hello")
    const result = parse.parse(DEFINITION_INPUT)

    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected error")
    }

    expect(result.input.cursor).toEqual(0)
    expect(result.value).toEqual("hello")
})
