import * as atom from "@src/atom"
import { Chain } from "@src/chain"
import type { Definition, Input, Result } from "@src/definition"

export type ParseResultError = {
    errorType: "ASTROPARSE::COMMON::TEXT::TEXT_INVALID",
    text: string
}

export class Text implements Definition<string, ParseResultError> {
    private readonly parser: Definition<string, ParseResultError>

    constructor(text: string) {
        this.parser = new Chain(
            new atom.Sequence(
                [...text]
                    .map((char) => new atom.Predicate(
                        new atom.Character(),
                        (c) => c === char
                            ? { success: true }
                            : { success: false, error: null }
                    ))
            )
        )
            .try()
            .map.value(() => text)
            .map.error(() : ParseResultError => ({
                errorType: "ASTROPARSE::COMMON::TEXT::TEXT_INVALID",
                text: text
            }))
    }

    parse(input : Input) : Result<string, ParseResultError> {
        return this.parser.parse(input)
    }
}
