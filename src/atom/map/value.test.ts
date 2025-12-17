import { test, expect } from "bun:test"
import * as parser from "@src"

const INPUT = { data: "xy", cursor: 0 }
const MAP_FN = () => "MAPPED"

test("parser.atom.map.Value applies mapping when parse succeeds", () => {
    const parse = new parser.atom.map.Value(new parser.atom.Character(), MAP_FN)
    const result = parse.parse(INPUT)
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual("MAPPED")
    expect(result.input.cursor).toEqual(1)
})

test("parser.atom.map.Value returns error unchanged when parse fails", () => {
    const mapCharacter = new parser.atom.map.Value(new parser.atom.Character(), MAP_FN)
    const result = mapCharacter.parse({ ...INPUT, cursor: 2 })
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.error).toEqual({ errorType: "ASTROPARSE::ATOM::CHARACTER::INPUT_END" })
    expect(result.input.cursor).toEqual(2)
})
