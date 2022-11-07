import { useProjectHandleText } from 'hooks/ProjectHandleText'
import Link from 'next/link'
import { CSSProperties } from 'react'
import { v2v3ProjectRoute } from 'utils/routes'

export default function V2V3ProjectHandleLink({
  projectId,
  handle,
  style,
}: {
  projectId: number
  handle?: string | null
  style?: CSSProperties
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
        style={{ fontWeight: 500, ...style }}
        className="text-primary hover-text-action-primary hover-text-decoration-underline"
      >
        {handleText}
      </a>
    </Link>
  )
}
