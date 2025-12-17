import { test, expect } from "bun:test"
import * as parser from "@src"

const INPUT : parser.definition.Input = {
    data: "hello world",
    cursor: 0
}

test("parser.atom.Either throws if constructed without parsers", () => {
    expect(() => new parser.atom.Either([])).toThrow(parser.atom.either.ERROR_MSG)
})

test("parser.atom.Either skips non-consuming errors", () => {
    const parse = new parser.atom.Either([
        new parser.atom.Character(),
        new parser.atom.Character(),
        new parser.atom.map.Value(new parser.atom.Character(), () => 5)
    ])

    const result = parse.parse(INPUT)
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toBe("h")
    expect(result.input.cursor).toEqual(1)
})

test("parser.atom.Either selects the first successful parse", () => {
    const parse = new parser.atom.Either([
        new parser.atom.Error("error"),
        new parser.atom.Character(),
        new parser.atom.map.Value(new parser.atom.Character(), () => 5)
    ])

    const result = parse.parse(INPUT)
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual("h")
    expect(result.input.cursor).toEqual(1)
})

test("parser.atom.Either returns the last error if all parsers error", () => {
    const parse = new parser.atom.Either([
        new parser.atom.Error(5),
        new parser.atom.Error("error"),
        new parser.atom.Error("errorFinal"),
    ])

    const result = parse.parse(INPUT)
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.input.cursor).toEqual(0)
    expect(result.error).toEqual("errorFinal")
})

test("parser.atom.Either errors if an errored parser consumes input", () => {
    const parse = new parser.atom.Either([
        new parser.atom.Sequence([
            new parser.atom.Character(),
            new parser.atom.Error("errorFirst")
        ]),
        new parser.atom.Value("yo")
    ])

    const result = parse.parse(INPUT)
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.input.cursor).toEqual(1)
    expect(result.error).toEqual("errorFirst")
})
