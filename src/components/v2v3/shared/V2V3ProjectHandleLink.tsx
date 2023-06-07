import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { useProjectHandleText } from 'hooks/useProjectHandleText'
import Link from 'next/link'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { v2v3ProjectRoute } from 'utils/routes'

/**
 * Renders a link to a v2v3 project that displays its handle, or fallback text if handle is missing.
 */
export default function V2V3ProjectHandleLink({
  className,
  name,
  projectId,
  handle,
  withProjectAvatar = false,
}: {
  className?: string
  name?: string | null
  projectId: number
  handle?: string | null
  withProjectAvatar?: boolean
}) {
  const { handle: resolvedHandle, handleText } = useProjectHandleText({
    projectId,
    handle,
    name,
  })
  const tooltipText = handle ? t`Project #${projectId}` : undefined

  const firstLetterOfHandleText = useMemo(() => {
    if (!handleText) return null
    if (handleText.length === 0) return null
    if (handleText[0] === '@') return handleText[1]
    return handleText[0]
  }, [handleText])

  return (
    <Tooltip
      className="inline-flex items-center gap-3"
      title={tooltipText}
      open={tooltipText ? undefined : false}
    >
      {withProjectAvatar && firstLetterOfHandleText && (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-grey-300 font-medium uppercase text-grey-600 dark:bg-slate-400 dark:text-slate-100">
          {firstLetterOfHandleText}
        </div>
      )}
      <Link
        prefetch={false}
        href={v2v3ProjectRoute({ projectId })}
        as={v2v3ProjectRoute({ projectId, handle: resolvedHandle })}
        className={twMerge(
          'select-all font-medium leading-[22px] text-grey-900 hover:text-bluebs-500 hover:underline dark:text-slate-100',
          className,
        )}
      >
        {handleText}
      </Link>
    </Tooltip>
  )
}
