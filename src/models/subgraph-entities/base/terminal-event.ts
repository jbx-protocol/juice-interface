export interface TerminalEventEntity {
  terminal: string
}

export type TerminalEventEntityJson = Partial<
  Record<keyof TerminalEventEntity, string>
>

export const parseTerminalEventEntity = (
  j: TerminalEventEntityJson,
): Partial<TerminalEventEntity> => ({
  terminal: j.terminal,
})
