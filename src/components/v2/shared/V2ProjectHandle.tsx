import { Trans } from '@lingui/macro'
import useProjectHandle from 'hooks/v2/contractReader/ProjectHandle'
import Link from 'next/link'
import { CSSProperties } from 'react'
import { v2ProjectRoute } from 'utils/routes'

export default function V2ProjectHandle({
  projectId,
  style,
}: {
  projectId: number
  style?: CSSProperties
}) {
  const { data: handle } = useProjectHandle({ projectId })

  return (
    <Link href={v2ProjectRoute({ projectId, handle })}>
      <a
        style={{ fontWeight: 500, marginRight: '0.5rem', ...style }}
        className="text-primary hover-text-action-primary hover-text-decoration-underline"
      >
        {handle ? `@${handle}` : <Trans>Project {projectId}</Trans>}
      </a>
    </Link>
  )
}
