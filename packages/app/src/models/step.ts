export interface Step {
  title: string
  content: JSX.Element
  info?: string[]
  validate?: () => Promise<unknown>
}
