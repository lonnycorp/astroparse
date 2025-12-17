import type { Input, Definition, Result } from "@src/definition"

export class Try<TValue, TError> implements Definition<TValue, TError> {
    constructor(private readonly parser : Definition<TValue, TError>) {}

    parse(input : Input) : Result<TValue, TError> {
        const result = this.parser.parse(input)
        if (result.success) {
            return result
        }

        return { success: false, error: result.error, input: input }
    }
}
