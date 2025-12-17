import * as atom from "@src/atom"
import { Chain } from "@src/chain"
import type { Definition, Input, Result } from "@src/definition"

export class SeparatedBy<TValue, TError, TSeparatorError>
implements Definition<TValue[], TError | TSeparatorError> {
    private readonly parser : Definition<TValue[], TError | TSeparatorError>

    constructor(
        parser : Definition<TValue, TError>,
        separatorParser : Definition<unknown, TSeparatorError>,
        atLeastOne = false
    ) {
        const tailParser = new Chain(
            new atom.Sequence([
                separatorParser,
                parser
            ])
        ).map.value(([, value]) => value)

        const oneOrMoreParser = new Chain(
            new atom.Sequence([
                parser,
                tailParser.many()
            ])
        ).map.value(([value, values]) => [value, ...values])

        this.parser = atLeastOne
            ? oneOrMoreParser
            : new atom.Either([
                oneOrMoreParser,
                new atom.Value<TValue[]>([])
            ])
    }

    parse(input : Input) : Result<TValue[], TError | TSeparatorError> {
        return this.parser.parse(input)
    }
}
