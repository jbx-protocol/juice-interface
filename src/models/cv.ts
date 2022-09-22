import { V1TerminalVersion } from 'models/v1/terminals'
export type V2CVType = '2'
export type V3CVType = '3'

// CV = contracts version
export type CV = V1TerminalVersion | V2CVType | V3CVType
