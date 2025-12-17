import { test, expect } from "bun:test"
import * as parser from "@src"

const createInput = (data: string, cursor = 0): parser.definition.Input => ({
    data,
    cursor
})

test("new parser.common.Whitespace() returns null without consuming empty input", () => {
    const result = new parser.common.Whitespace().parse(createInput(""))

    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toBeNull()
    expect(result.input.cursor).toEqual(0)
})

test("new parser.common.Whitespace() consumes whitespace until the first non-whitespace character", () => {
    const result = new parser.common.Whitespace().parse(createInput(" \t\nabc"))

    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toBeNull()
    expect(result.input.cursor).toEqual(3)
})

test("new parser.common.Whitespace() consumes all input when only whitespace is present", () => {
    const input = "  \r\n\t"
    const result = new parser.common.Whitespace().parse(createInput(input))

    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toBeNull()
    expect(result.input.cursor).toEqual(input.length)
})
