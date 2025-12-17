import type { Definition, Input, Result } from "@src/definition"

export const ERROR_MSG = "atom.Either is empty"

export type ParseResult<TParsers extends Definition<any, any>[]> = Result<
   TParsers[number] extends Definition<infer TValue, any> ? TValue : never,
   TParsers[number] extends Definition<any, infer TError> ? TError : never
>
export class Either<const TParsers extends Definition<any, any>[]>
implements Definition<
        TParsers[number] extends Definition<infer TValue, any> ? TValue : never,
        TParsers[number] extends Definition<any, infer TError> ? TError : never
    > {
    private readonly parsers : TParsers

    constructor(parsers : TParsers) {
        this.parsers = parsers
        if (this.parsers.length === 0) {
            throw new Error(ERROR_MSG)
        }
    }

    parse(input : Input) : ParseResult<TParsers> {
        let lastFailure : ParseResult<TParsers> | null = null

        for (const parser of this.parsers) {
            const result = parser.parse(input)
            if (result.success || result.input.cursor !== input.cursor) {
                return result
            }

            lastFailure = result
        }

        if (lastFailure === null) {
            throw new Error("Invariant: atom.Either parsed with no parsers")
        }

        return lastFailure
    }
}
