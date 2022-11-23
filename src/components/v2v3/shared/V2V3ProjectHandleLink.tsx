import { useProjectHandleText } from 'hooks/ProjectHandleText'
import Link from 'next/link'
import { classNames } from 'utils/classNames'
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
        className={classNames(
          'font-medium text-black hover:text-haze-400 hover:underline dark:text-grey-100 dark:hover:text-haze-400',
          className,
        )}
      >
        {handleText}
      </a>
    </Link>
  )
}
