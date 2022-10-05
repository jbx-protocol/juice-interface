import { V1TerminalVersion } from 'models/v1/terminals'
export type V2CVType = '2'
export type V3CVType = '3'
export type V2V3CVType = V2CVType | V3CVType

// CV = contracts version
export type CV = V1TerminalVersion | V2V3CVType
