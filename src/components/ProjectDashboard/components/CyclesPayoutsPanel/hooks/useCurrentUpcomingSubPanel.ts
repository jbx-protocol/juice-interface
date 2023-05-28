// TODO: Tests
export const useCurrentUpcomingSubPanel = (type: 'current' | 'upcoming') => {
  if (type === 'current') {
    return {
      type,
      cycleNumber: 21,
      status: 'Locked',
      remainingTime: '23d 23h 59m 59s',
      // TODO: replace with real data
      cycleConfiguration: {},
    }
  }
  return {
    type,
    cycleNumber: 22,
    status: 'Locked',
    cycleLength: '30 days',
    cycleConfiguration: {},
  }
}
