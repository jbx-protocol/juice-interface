export interface TerminalEventEntity {
  terminal: string
}

export type TerminalEventEntityJson = Partial<
  Record<keyof TerminalEventEntity, string>
>
