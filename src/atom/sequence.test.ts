import { test, expect } from "bun:test"
import * as parser from "@src"

const INPUT : parser.definition.Input = {
    data: "hello world",
    cursor: 0
}

test("parser.atom.Sequence parses in sequence", () => {
    const parse = new parser.atom.Sequence([
        new parser.atom.Character(),
        new parser.atom.Character(),
        new parser.atom.map.Value(new parser.atom.Character(), () => 5)
    ])

    const result = parse.parse(INPUT)
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual(["h", "e", 5])
    expect(result.input.cursor).toEqual(3)
})

test("parser.atom.Sequence returns the first error it encounters", () => {
    const parse = new parser.atom.Sequence([
        new parser.atom.Character(),
        new parser.atom.Character(),
        new parser.atom.Error("boom")
    ])

    const result = parse.parse(INPUT)
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.input.cursor).toEqual(2)
    expect(result.error).toEqual("boom")
})
