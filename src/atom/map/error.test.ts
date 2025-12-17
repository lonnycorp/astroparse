import { test, expect } from "bun:test"
import * as parser from "@src"

const INPUT = { data: "xy", cursor: 0 }
const MAP_FN = () => "MAPPED"

test("parser.atom.map.Error returns original success result unchanged", () => {
    const parse = new parser.atom.map.Error(new parser.atom.Character(), MAP_FN)
    const result = parse.parse(INPUT)
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual("x")
    expect(result.input.cursor).toEqual(1)
})

test("parser.atom.map.Error maps error when parse fails", () => {
    const parse = new parser.atom.map.Error(new parser.atom.Character(), MAP_FN)
    const result = parse.parse({ ...INPUT, cursor: 2 })
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.error).toEqual("MAPPED")
    expect(result.input.cursor).toEqual(2)
})
