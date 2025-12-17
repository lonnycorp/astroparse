import type { Input, Definition, Result } from "@src/definition"

export type PredicateResult<TErrorPred> =
    | { success: true, error?: never }
    | { success: false, error: TErrorPred }

export type PredicateFn<TValue, TErrorPred> = (
    value : TValue
) => PredicateResult<TErrorPred>

export class Predicate<TValue, TError, TErrorPred>
implements Definition<TValue, TError | TErrorPred> {
    constructor(
        private readonly parser: Definition<TValue, TError>,
        private readonly predicateFn: (value : TValue) => PredicateResult<TErrorPred>
    ) {}

    parse(input : Input) : Result<TValue, TError | TErrorPred> {
        const result = this.parser.parse(input)
        if (!result.success) {
            return result
        }

        const predicateResult = this.predicateFn(result.value)
        if (predicateResult.success) {
            return result
        }

        return {
            success: false,
            error: predicateResult.error,
            input: result.input
        }
    }
}
