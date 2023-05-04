import { BigNumber } from 'ethers'

type Primitive = string | number | boolean | symbol | null | undefined

export type Json<T> = {
  [K in keyof T]: T[K] extends Primitive
    ? T[K]
    : T[K] extends Array<infer A>
    ? Json<A>[]
    : T[K] extends BigNumber
    ? string
    : T[K] extends BigNumber | undefined
    ? string | undefined
    : T[K] extends BigNumber | null
    ? string | null
    : T[K] extends BigNumber | null | undefined
    ? string | null | undefined
    : Json<T[K]>
}

export function primitives<T>(json: Json<T>) {
  return Object.entries(json).reduce((acc, [k, v]) => {
    const _primitives = new Set([
      'string',
      'number',
      'boolean',
      'symbol',
      'null',
      'undefined',
    ])

    return {
      ...acc,
      ...(_primitives.has(typeof v) ? { [k]: v } : {}),
    }
  }, {} as { [k in keyof T]: T[k] extends Primitive ? T[k] : unknown })
}
