# AstroParse

![Check](https://github.com/lonnycorp/astroparse/actions/workflows/check.yml/badge.svg)
![Release](https://github.com/lonnycorp/astroparse/actions/workflows/release.yml/badge.svg)

A minimal, zero dependency, fully-typed parser combinator library.

## Installation

```bash
npm install astroparse
```

## Quick Look

```typescript
import * as parser from "astroparse"

const parserName = new parser.Chain(
    new parser.atom.Predicate(
        new parser.atom.Character(),
        c => /[a-zA-Z]/.test(c)
            ? { success: true }
            : { success: false, error: null }
    )
)
    .try()
    .many()
    .map.value(chars => chars.join("").toUpperCase())


const parserShout = new parser.Chain(
    new parser.atom.Sequence([
        new parser.common.Text("hello"),
        new parser.common.Whitespace(),
        parserName
    ])
)
    .map.value(([, , name]) => `Hello, ${name}!`)
```

```typescript
const result = parserShout.parse({ data: "hello \tsteven", cursor: 0 })

if (result.success) {
    console.log(result.value) // Hello, STEVEN!
} else {
    console.error(result.error)
}
```

The same parser can be written with explicit atoms:

```typescript
const parserNameExplicit = new parser.atom.map.Value(
    new parser.atom.Many(
        new parser.atom.Try(
            new parser.atom.Predicate(
                new parser.atom.Character(),
                c => /[a-zA-Z]/.test(c)
                    ? { success: true }
                    : { success: false, error: null }
            )
        )
    ),
    (chars) => chars.join("").toUpperCase()
)


const parserShoutExplicit = new parser.atom.map.Value(
    new parser.atom.Sequence([
        new parser.common.Text("hello"),
        new parser.common.Whitespace(),
        parserNameExplicit
    ]),
    ([,, name]) => `Hello, ${name}!`
)
```

## Parser Definition

A parser is simply a `Definition<TValue, TError>`: an object with a `parse` function that takes a `definition.Input` and returns a `definition.Result<TValue, TError>`.

```typescript
export interface Definition<TValue, TError> {
    parse(input: Input): Result<TValue, TError>
}
```

A `definition.Input` is simply an object containing some string to be parsed, and a cursor describing how much of the string has been consumed.

```typescript
export type Input = {
    data: string
    cursor: number
}
```

A `definition.Result<TValue, TError>` is a discriminated union type describing either a successful or failed parse on a given input:

```typescript
export type Result<TValue, TError> =
    | ResultValue<TValue>
    | ResultError<TError>
```

A successful parse will return a `definition.ResultValue<TValue>` object, containing a boolean (true) success discriminator, the value parsed from the input (of type `TValue`) and a new `definition.Input` reflecting any potential changes to input consumption:

```typescript
export type ResultValue<TValue> = {
    success: true
    value: TValue,
    input: Input
}
```

A failed parse will return a `definition.ResultError<TError>` object, containing a boolean (false) success discriminator, the error returned by the parser (of type `TError`) and a new `definition.Input` reflecting any potential changes to input consumption:

```typescript
export type ResultError<TError> = {
    success: false
    error: TError,
    input: Input
}
```

It is possible to create your own custom parsers by directly implementing classes or objects that conform to the above spec. However, it is recommended that you instead construct custom parsers by composing the suite of atomic parsers provided by AstroParse where possible (it is a parser _combinator_ library after all!)

## Atomic Parsers

AstroParse provides a minimal (but arguably "complete") set of generic, atomic parsers:

 - `atom.Character`: consumes and returns the next input character. Errors if at the end of the input.
 - `atom.End`: complements `atom.Character` - returns a null if at the end of the input. Errors otherwise.
 - `atom.Value`: always "parses" a specified value without consuming any input.
 - `atom.Error`: always returns a specified error without consuming any input.
 - `atom.Predicate`: wraps an existing parser, checking the result against a predicate function and erroring if the predicate fails.
 - `atom.Try`: wraps an existing parser, backtracking any consumed input if the inner parser errors.
 - `atom.Peek`: wraps an existing parser, backtracking any consumed input.
 - `atom.Many`: wraps an existing parser, applying it repeatedly to produce an array of parsed values until an error is observed. The error will propagate if the erroring parser has consumed input.
 - `atom.Either`: wraps an array of parsers, attempting to parse each in order until a first value is successfully parsed. Any errors produced by sub-parsers will only propagate if input has been consumed.
 - `atom.Sequence`: wraps an array of parsers, attempting to parse each in sequence until all have successfully parsed. Any errors produced by sub-parsers are propagated straight away.
 - `atom.map.Value`: wraps a parser with a mapping function that transforms any parsed value whilst ignoring errors.
 - `atom.map.Error`: wraps a parser with a mapping function that transforms any errors whilst ignoring parsed values.

## Common Parsers

AstroParse also provides a very small set of common parsers where the behavior is broadly useful and intentionally opinionated:

- `common.Text`: parses a specified text string exactly as-is. The string is treated atomically and will not consume input on failure.
- `common.Whitespace`: parses a (potentially empty) region of whitespace. Will never return an error.
- `common.SeparatedBy`: parses values separated by a separator parser. Parses zero or more by default, or one or more when `atLeastOne` is true.

## Chaining

For more compact composition, `Chain` wraps any parser definition and returns another parser definition with fluent helpers. Common parsers use this internally where it keeps the composition readable.

```typescript
const parserName = new parser.Chain(
    new parser.atom.Predicate(
        new parser.atom.Character(),
        c => /[a-zA-Z]/.test(c)
            ? { success: true }
            : { success: false, error: null }
    )
)
    .try()
    .many()
    .map.value(chars => chars.join("").toUpperCase())
```

The chain helpers mirror the most common unary wrappers: `map.value`, `map.error`, `try`, `peek`, and `many`.
