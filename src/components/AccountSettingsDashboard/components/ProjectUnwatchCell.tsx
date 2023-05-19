import { useProjectHandleText } from 'hooks/useProjectHandleText'
import { useProjectMetadata } from 'hooks/useProjectMetadata'
import Link from 'next/link'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { v2v3ProjectRoute } from 'utils/routes'
import { useProjectUnwatchCellData } from '../hooks/useProjectUnwatchCellData'
import { UnwatchButton } from './UnwatchButton'

export const ProjectUnwatchCell = ({
  className,
  projectId,
  onUnwatch,
}: {
  className?: string
  projectId: number
  onUnwatch?: () => void
}) => {
  const data = useProjectUnwatchCellData({ projectId })
  const { data: metadata } = useProjectMetadata(data?.metadataUri)
  const projectName = metadata?.name

  const { handleText } = useProjectHandleText({
    handle: data?.handle,
    projectId,
  })

  const cellPrimaryText = useMemo(() => {
    if (projectName) {
      return projectName
    }
    if (handleText) {
      return handleText
    }
    return `Project #${projectId}`
  }, [handleText, projectId, projectName])

  const cellSecondaryText = useMemo(() => {
    if (projectName && handleText) {
      return handleText
    }
    if (handleText) {
      return `#${projectId}`
    }
    return ''
  }, [handleText, projectId, projectName])

  return (
    <div
      className={twMerge(
        'flex items-center justify-between gap-4 py-3 px-4',
        className,
      )}
    >
      <Link
        href={v2v3ProjectRoute({ projectId })}
        className="flex gap-2 overflow-hidden whitespace-nowrap"
      >
        <span className="text-primary max-w-xs shrink overflow-hidden text-ellipsis font-medium hover:text-grey-500 dark:hover:text-slate-200">
          {cellPrimaryText}
        </span>
        <span className="text-secondary hidden md:inline">
          {cellSecondaryText}
        </span>
      </Link>
      <UnwatchButton onClick={onUnwatch} />
    </div>
  )
}
