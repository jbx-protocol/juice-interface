import { BigNumberish } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import ProjectVersionBadge from 'components/ProjectVersionBadge'
import { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

export default function V2ProjectHandle({
  projectId,
  style,
}: {
  projectId: BigNumberish
  style?: CSSProperties
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Link
        to={`/v2/p/${projectId}`}
        style={{ fontWeight: 500, ...style }}
        className="text-primary hover-text-action-primary hover-text-decoration-underline"
      >
        <span style={{ marginRight: '0.5rem' }}>
          <Trans>Project {projectId}</Trans>
        </span>
      </Link>
      <ProjectVersionBadge versionText="V2" size="small" />
    </div>
  )
}
