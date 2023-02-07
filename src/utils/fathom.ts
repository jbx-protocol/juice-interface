import { fathom } from '../lib/fathom'

export const trackFathomGoal = (eventId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(fathom as any)?.trackGoal(eventId, 0)
}
