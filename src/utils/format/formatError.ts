export function formatError(error: unknown): string {
  return typeof error === 'string'
    ? error
    : (error as { message: string }).message
    ? (error as { message: string }).message
    : 'Failed to parse error'
}
