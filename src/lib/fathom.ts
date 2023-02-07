interface Fathom {
  trackGoal: (eventId: string, value: number) => void
}

let fathom: Fathom | undefined = undefined
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fathom = (window as any).fathom
}

export const trackFathomGoal = (eventId: string) => {
  fathom?.trackGoal(eventId, 0)
}

export { fathom }
