import { useProjectHandleText } from 'hooks/ProjectHandleText'
import Link from 'next/link'
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
}: {
  className?: string
  name?: string
  projectId: number
  handle?: string | null
}) {
  const { handle: resolvedHandle, handleText } = useProjectHandleText({
    projectId,
    handle,
    name,
  })

  return (
    <Link
      href={v2v3ProjectRoute({ projectId })}
      as={v2v3ProjectRoute({ projectId, handle: resolvedHandle })}
    >
      <a
        className={twMerge(
          'select-all leading-[22px] text-grey-900 hover:text-bluebs-500 hover:underline dark:text-slate-100',
          className,
        )}
      >
        {handleText}
      </a>
    </Link>
  )
}
