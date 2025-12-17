import type { Definition, Input, ResultValue } from "@src/definition"

export class Value<TValue> implements Definition<TValue, never> {
    constructor(private readonly value: TValue) {}

    parse(input : Input) : ResultValue<TValue> {
        return {
            success: true,
            input: input,
            value: this.value
        }
    }
}
