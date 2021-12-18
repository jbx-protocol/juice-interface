const HELP_PAGE_HOSTNAME = 'https://docs.juicebox.money'

export function helpPagePath(path: string): string {
  return new URL(path, HELP_PAGE_HOSTNAME).toString()
}
