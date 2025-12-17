import { test, expect } from "bun:test"
import * as parser from "@src"

const INPUT : parser.definition.Input = {
    data: "hello",
    cursor: 0
}

test("parser.common.Text correctly parses a word", () => {
    const parse = new parser.common.Text("hell")
    const result = parse.parse(INPUT) as parser.definition.ResultValue<string>

    expect(result.success).toBe(true)
    expect(result.input.cursor).toEqual(4)
    expect(result.value).toEqual("hell")
})

test("parser.common.Text errors if the word doesn't match without consuming input", () => {
    const parse = new parser.common.Text("helg")
    const result = parse.parse(INPUT) as parser.definition.ResultError<parser.common.text.ParseResultError>

    expect(result.success).toBe(false)
    expect(result.input.cursor).toEqual(0)
    expect(result.error).toEqual({
        errorType: "ASTROPARSE::COMMON::TEXT::TEXT_INVALID",
        text: "helg"
    })
})

test("parser.common.Text errors if the input runs out without consuming input", () => {
    const parse = new parser.common.Text("helloo")
    const result = parse.parse(INPUT) as parser.definition.ResultError<parser.common.text.ParseResultError>

    expect(result.success).toEqual(false)
    expect(result.input.cursor).toEqual(0)
    expect(result.error).toEqual({
        errorType: "ASTROPARSE::COMMON::TEXT::TEXT_INVALID",
        text: "helloo"
    })
})
