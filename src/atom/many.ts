import type { Input, Definition, Result } from "@src/definition"

export const ERROR_MSG = "atom.Many cannot repeat a parser that succeeds without consuming input"

export class Many<TValue, TError> implements Definition<TValue[], TError> {
    constructor(private readonly parser : Definition<TValue, TError>) {}

    parse(input : Input) : Result<TValue[], TError> {
        const results : TValue[] = []
        let current = input

        while (true) {
            const result = this.parser.parse(current)
            if (result.success) {
                if (result.input.cursor <= current.cursor) {
                    throw new Error(ERROR_MSG)
                }

                results.push(result.value)
                current = result.input
            } else if (result.input.cursor !== current.cursor) {
                return result
            } else {
                break
            }
        }

        return {
            success: true,
            input: current,
            value: results
        }
    }
}
