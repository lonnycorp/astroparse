export type Input = Readonly<{
    data: string
    cursor: number
}>

export type ResultValue<TValue> = {
    success: true,
    input: Input
    value: TValue
}

export type ResultError<TError> = {
    success: false,
    input: Input
    error: TError,
}

export type Result<TValue, TError> =
    | ResultValue<TValue>
    | ResultError<TError>

export interface Definition<TValue, TError> {
    parse(input : Input): Result<TValue, TError>
}
