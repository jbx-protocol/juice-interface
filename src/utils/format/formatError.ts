export function formatError(error: unknown): string {
  return typeof error === 'string'
    ? error
    : (error as { message: string }).message
    ? JSON.stringify(error)
    : 'Failed to parse error'
}
