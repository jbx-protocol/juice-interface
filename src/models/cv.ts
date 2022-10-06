import { V1TerminalVersion } from 'models/v1/terminals'
export type CV2 = '2'
export type CV3 = '3'
export type CV2V3 = CV2 | CV3

// CV = contracts version
export type CV = V1TerminalVersion | CV2V3
