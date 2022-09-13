import { Trans } from '@lingui/macro'
import useProjectHandle from 'hooks/v2/contractReader/ProjectHandle'
import Link from 'next/link'
import { CSSProperties } from 'react'
import { v2ProjectRoute } from 'utils/routes'

export default function V2ProjectHandle({
  projectId,
  handle,
  style,
}: {
  projectId: number
  handle?: string | null
  style?: CSSProperties
}) {
  const { data: _handle } = useProjectHandle({
    projectId: !handle ? projectId : undefined,
  })
  const handleToRender = handle ?? _handle

  return (
    <Link href={v2ProjectRoute({ projectId, handle: handleToRender })}>
      <a
        style={{ fontWeight: 500, marginRight: '0.5rem', ...style }}
        className="text-primary hover-text-action-primary hover-text-decoration-underline"
      >
        {handleToRender ? (
          `@${handleToRender}`
        ) : (
          <Trans>Project #{projectId}</Trans>
        )}
      </a>
    </Link>
  )
}
