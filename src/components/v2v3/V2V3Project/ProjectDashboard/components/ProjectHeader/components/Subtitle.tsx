import { Trans } from '@lingui/macro'
import { useProjectPageQueries } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectPageQueries'
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
        // max width of 480px is roughly 50 characters
        className="inline min-w-0 max-w-[480px] truncate whitespace-nowrap text-grey-700 dark:text-slate-50 md:text-lg"
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
