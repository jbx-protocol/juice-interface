import { Trans } from '@lingui/macro'
import useProjectHandle from 'hooks/v2/contractReader/ProjectHandle'
import { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
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
    <Link
      to={v2ProjectRoute({ projectId, handle })}
      style={{ fontWeight: 500, ...style }}
      className="text-primary hover-text-action-primary hover-text-decoration-underline"
    >
      <span style={{ marginRight: '0.5rem' }}>
        {handle ? `@${handle}` : <Trans>Project {projectId}</Trans>}
      </span>
    </Link>
  )
}
