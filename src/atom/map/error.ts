import type { Input, Definition, Result } from "@src/definition"

export class Error<TValue, TErrorIn, TErrorOut> implements Definition<TValue, TErrorOut> {
    constructor(
        private readonly parser: Definition<TValue, TErrorIn>,
        private readonly mapFn: (value: TErrorIn) => TErrorOut
    ) {}

    parse(input : Input) : Result<TValue, TErrorOut> {
        const result = this.parser.parse(input)

        if (result.success) {
            return result
        }

        return {
            success: false,
            input: result.input,
            error: this.mapFn(result.error)
        }
    }
}
