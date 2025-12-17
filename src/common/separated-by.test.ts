import { test, expect } from "bun:test"
import * as parser from "@src"

const createInput = (data : string) => ({ data, cursor: 0 })

test("new parser.common.SeparatedBy() returns an empty array when the first parser does not match", () => {
    const parse = new parser.common.SeparatedBy(
        new parser.common.Text("a"),
        new parser.common.Text(",")
    )

    const result = parse.parse(createInput(""))
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual([])
    expect(result.input.cursor).toEqual(0)
})

test("new parser.common.SeparatedBy() parses values separated by separators", () => {
    const parse = new parser.common.SeparatedBy(
        new parser.common.Text("a"),
        new parser.common.Text(",")
    )

    const result = parse.parse(createInput("a,a,a"))
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual(["a", "a", "a"])
    expect(result.input.cursor).toEqual(5)
})

test("new parser.common.SeparatedBy() can require at least one value", () => {
    const parse = new parser.common.SeparatedBy(
        new parser.common.Text("a"),
        new parser.common.Text(","),
        true
    )

    const result = parse.parse(createInput("")) as parser.definition.ResultError<
        parser.common.text.ParseResultError
    >
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.error).toEqual({
        errorType: "ASTROPARSE::COMMON::TEXT::TEXT_INVALID",
        text: "a"
    })
    expect(result.input.cursor).toEqual(0)
})

test("new parser.common.SeparatedBy() parses one or more values when required", () => {
    const parse = new parser.common.SeparatedBy(
        new parser.common.Text("a"),
        new parser.common.Text(","),
        true
    )

    const result = parse.parse(createInput("a,a"))
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual(["a", "a"])
    expect(result.input.cursor).toEqual(3)
})

test("new parser.common.SeparatedBy() stops before an absent separator", () => {
    const parse = new parser.common.SeparatedBy(
        new parser.common.Text("a"),
        new parser.common.Text(",")
    )

    const result = parse.parse(createInput("aa"))
    expect(result.success).toBe(true)
    if (!result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.value).toEqual(["a"])
    expect(result.input.cursor).toEqual(1)
})

test("new parser.common.SeparatedBy() errors when a trailing separator is present", () => {
    const parse = new parser.common.SeparatedBy(
        new parser.common.Text("a"),
        new parser.common.Text(",")
    )

    const result = parse.parse(createInput("a,")) as parser.definition.ResultError<
        parser.common.text.ParseResultError
    >
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.error).toEqual({
        errorType: "ASTROPARSE::COMMON::TEXT::TEXT_INVALID",
        text: "a"
    })
    expect(result.input.cursor).toEqual(2)
})

test("new parser.common.SeparatedBy() propagates consumed value parser failures", () => {
    const parse = new parser.common.SeparatedBy(
        new parser.atom.Predicate(
            new parser.atom.Character(),
            (value) => value === "a"
                ? { success: true }
                : { success: false, error: "value" }
        ),
        new parser.common.Text(",")
    )

    const result = parse.parse(createInput("b")) as parser.definition.ResultError<string>
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.error).toEqual("value")
    expect(result.input.cursor).toEqual(1)
})

test("new parser.common.SeparatedBy() propagates consumed separator parser failures", () => {
    const parse = new parser.common.SeparatedBy(
        new parser.common.Text("a"),
        new parser.atom.Predicate(
            new parser.atom.Character(),
            (value) => value === ","
                ? { success: true }
                : { success: false, error: "separator" }
        )
    )

    const result = parse.parse(createInput("a;b")) as parser.definition.ResultError<string>
    expect(result.success).toBe(false)
    if (result.success) {
        throw new Error("Unexpected success")
    }

    expect(result.error).toEqual("separator")
    expect(result.input.cursor).toEqual(2)
})
