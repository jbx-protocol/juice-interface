import { V1TerminalVersion } from 'models/v1/terminals'

import { Int } from './number'

export type PV2 = '2'

// PV = project version
export type PV = V1TerminalVersion | PV2

// Stringified positive integer between 1 and 99999 inclusive
// Note: Raising range to 1-100000 breaks typescript and falls back to "any": "Expression produces a union type that is too complex to represent. ts(2590)".
// TS convo on integer range types (plzzz) https://github.com/microsoft/TypeScript/issues/15480
export type Gt0Lt10000 =
  | `${Exclude<Int, 0>}`
  | `${Int}${Int}`
  | `${Int}${Int}${Int}`
  | `${Int}${Int}${Int}${Int}`

/**
 * Universal ID format for Juicebox projects.
 *
 * Examples: `1-1`, `1.1-123`, `2-4567`
 */
export type PID = `${PV}-${Gt0Lt10000}`
