import type { Definition, Input, ResultError } from "@src/definition"

export class Error<TError> implements Definition<never, TError> {
    constructor(private readonly error: TError) {}

    parse(input : Input) : ResultError<TError> {
        return {
            success: false,
            input: input,
            error: this.error
        }
    }
}
