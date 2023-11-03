import { t } from '@lingui/macro'
import { useMemo } from 'react'

export const useConfigurationDisplayCard = (type: 'current' | 'upcoming') => {
  const title = useMemo(() => {
    if (type === 'current') {
      return t`Current cycle`
    }
    return t`Upcoming cycle`
  }, [type])

  return {
    title,
  }
}
