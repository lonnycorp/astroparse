import type { Input, Definition, Result } from "@src/definition"

export class Value<TValueIn, TValueOut, TError> implements Definition<TValueOut, TError> {
    constructor(
        private readonly parser: Definition<TValueIn, TError>,
        private readonly mapFn: (value: TValueIn) => TValueOut
    ) {}

    parse(input : Input) : Result<TValueOut, TError> {
        const result = this.parser.parse(input)

        if (!result.success) {
            return result
        }

        return {
            success: true,
            input: result.input,
            value: this.mapFn(result.value)
        }
    }
}
