import type { Definition, Input, Result } from "@src/definition"

export type ParseResultError = {
    errorType: "ASTROPARSE::ATOM::CHARACTER::INPUT_END"
}

export class Character implements Definition<string, ParseResultError> {
    parse(input : Input) : Result<string, ParseResultError> {
        if (input.cursor >= input.data.length) {
            return {
                success: false,
                error: { errorType: "ASTROPARSE::ATOM::CHARACTER::INPUT_END" },
                input: input
            }
        }

        return {
            success: true,
            value: input.data[input.cursor] as string,
            input: {
                data: input.data,
                cursor: input.cursor + 1
            }
        }
    }
}
