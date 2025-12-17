import type { Definition, Input, Result } from "@src/definition"

export type ParseResultError = {
    errorType: "ASTROPARSE::ATOM::END::INPUT_NOT_END"
}

export class End implements Definition<null, ParseResultError> {
    parse(input : Input) : Result<null, ParseResultError> {
        if (input.cursor >= input.data.length) {
            return {
                success: true,
                value: null,
                input
            }
        }

        return {
            success: false,
            error: { errorType: "ASTROPARSE::ATOM::END::INPUT_NOT_END" },
            input: input
        }
    }
}
