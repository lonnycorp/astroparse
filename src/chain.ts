import * as atom from "@src/atom"
import type { Definition, Input, Result } from "@src/definition"

export class MapModule<TValue, TError> {
    constructor(private readonly definition : Definition<TValue, TError>) {}

    value<TValueOut>(mapFn : (value : TValue) => TValueOut) : Chain<TValueOut, TError> {
        return new Chain(new atom.map.Value(this.definition, mapFn))
    }

    error<TErrorOut>(mapFn : (error : TError) => TErrorOut) : Chain<TValue, TErrorOut> {
        return new Chain(new atom.map.Error(this.definition, mapFn))
    }
}

export class Chain<TValue, TError>
implements Definition<TValue, TError> {
    readonly definition : Definition<TValue, TError>
    readonly map : MapModule<TValue, TError>

    constructor(definition : Definition<TValue, TError>) {
        this.definition = definition
        this.map = new MapModule(definition)
    }

    parse(input : Input) : Result<TValue, TError> {
        return this.definition.parse(input)
    }

    try() : Chain<TValue, TError> {
        return new Chain(new atom.Try(this.definition))
    }

    peek() : Chain<TValue, TError> {
        return new Chain(new atom.Peek(this.definition))
    }

    many() : Chain<TValue[], TError> {
        return new Chain(new atom.Many(this.definition))
    }
}
