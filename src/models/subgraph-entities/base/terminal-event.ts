import { Json } from 'models/json'

export interface TerminalEventEntity {
  terminal: string
}

export const parseTerminalEventEntity = (
  j: Json<TerminalEventEntity>,
): TerminalEventEntity => ({
  ...j,
})
