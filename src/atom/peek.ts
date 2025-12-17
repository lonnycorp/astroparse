import type { Input, Definition, Result } from "@src/definition"

export class Peek<TValue, TError> implements Definition<TValue, TError> {
    constructor(private readonly parser : Definition<TValue, TError>) {}

    parse(input : Input) : Result<TValue, TError> {
        const result = this.parser.parse(input)
        if (result.success) {
            return {
                success: true,
                value: result.value,
                input: input
            }
        }

        return {
            success: false,
            error: result.error,
            input: input
        }
    }
}
