import type { Definition, Input, Result } from "@src/definition"

export type ParseResult<TParsers extends Definition<any, any>[]> = Result<
   { [TIndex in keyof TParsers]: TParsers[TIndex] extends Definition<infer TValue, any> ? TValue : never },
   TParsers[number] extends Definition<any, infer TError> ? TError : never
>

export class Sequence<const TParsers extends Definition<any, any>[]>
implements Definition<
        { [TIndex in keyof TParsers]: TParsers[TIndex] extends Definition<infer TValue, any> ? TValue : never },
        TParsers[number] extends Definition<any, infer TError> ? TError : never
    > {
    constructor(private readonly parsers : TParsers) {}

    parse(input : Input) : ParseResult<TParsers> {
        let current = input
        const values: unknown[] = []

        for (const parser of this.parsers) {
            const result = parser.parse(current)
            if (result.success) {
                values.push(result.value)
                current = result.input
                continue
            }

            return result
        }

        return {
            success: true,
            input: current,
            value: values
        } as ParseResult<TParsers>
    }
}
