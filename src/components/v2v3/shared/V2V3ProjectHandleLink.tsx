import { useProjectHandleText } from 'hooks/ProjectHandleText'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { v2v3ProjectRoute } from 'utils/routes'

export default function V2V3ProjectHandleLink({
  className,
  projectId,
  handle,
}: {
  className?: string
  projectId: number
  handle?: string | null
}) {
  const { handle: resolvedHandle, handleText } = useProjectHandleText({
    projectId,
    handle,
  })

  return (
    <Link
      href={v2v3ProjectRoute({ projectId })}
      as={v2v3ProjectRoute({ projectId, handle: resolvedHandle })}
    >
      <a
        className={twMerge(
          'select-all leading-[22px] text-grey-900 hover:text-haze-400 hover:underline dark:text-slate-100',
          className,
        )}
      >
        {handleText}
      </a>
    </Link>
  )
}
