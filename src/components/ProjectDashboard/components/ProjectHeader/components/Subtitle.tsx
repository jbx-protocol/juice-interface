import { Trans } from '@lingui/macro'
import { useProjectPageQueries } from 'components/ProjectDashboard/hooks/useProjectPageQueries'
import { useCallback, useEffect, useRef, useState } from 'react'

export const Subtitle = ({ subtitle }: { subtitle: string }) => {
  const { setProjectPageTab } = useProjectPageQueries()

  const ref = useRef<HTMLDivElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  const checkTruncated = () => {
    if (!ref.current) return
    const { scrollWidth, clientWidth } = ref.current
    setIsTruncated(scrollWidth > clientWidth)
  }

  const handleReadMoreClicked = useCallback(
    () => setProjectPageTab('about'),
    [setProjectPageTab],
  )

  useEffect(() => {
    checkTruncated()
    window.addEventListener('resize', checkTruncated)

    return () => {
      window.removeEventListener('resize', checkTruncated)
    }
  }, [])

  return (
    <div className="flex min-w-0 items-center">
      <div
        ref={ref}
        className="inline min-w-0 truncate whitespace-nowrap text-lg text-grey-700 dark:text-slate-50"
      >
        {subtitle}
      </div>
      {isTruncated && (
        <a
          role="button"
          className="inline whitespace-nowrap"
          onClick={handleReadMoreClicked}
        >
          <Trans>Read more</Trans>
        </a>
      )}
    </div>
  )
}
