import { ProjectTimelineWindow, SepanaProjectTimeline } from 'models/sepana'
import { useMemo } from 'react'
import { floatFromWad } from 'utils/format/formatNumber'

export function useFormatTimelinePoints(
  timeline: SepanaProjectTimeline | undefined,
  window: ProjectTimelineWindow | undefined,
) {
  return useMemo(() => {
    if (!timeline) return undefined

    let _points

    switch (window) {
      case 7:
        _points = timeline.timeline7
        break
      case 30:
        _points = timeline.timeline30
        break
      case 365:
        _points = timeline.timeline365
        break
    }

    return _points?.map(p => ({
      ...p,
      balance: floatFromWad(p.balance),
      volume: floatFromWad(p.volume),
      trendingScore: floatFromWad(p.trendingScore),
    }))
  }, [timeline, window])
}
