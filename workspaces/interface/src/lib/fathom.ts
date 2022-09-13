let fathom: unknown = undefined
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fathom = (window as any).fathom
}
export { fathom }
