import * as atom from "@src/atom"
import { Chain } from "@src/chain"
import type { Definition, Input, Result } from "@src/definition"

const REGEX = /\s/
const INVARIANT_MSG = "Invariant: Definition errored unexpectedly"

export class Whitespace implements Definition<null, never> {
    private readonly parser = new Chain(
        new atom.Predicate(
            new atom.Character(),
            c => REGEX.test(c)
                ? { success: true }
                : { success: false, error: null }
        )
    )
        .try()
        .many()
        .map.value(() => null)
        .map.error(() => { throw new Error(INVARIANT_MSG) })

    parse(input : Input) : Result<null, never> {
        return this.parser.parse(input)
    }
}
