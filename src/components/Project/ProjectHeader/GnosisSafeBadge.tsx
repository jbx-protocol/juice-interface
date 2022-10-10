import Icon from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import Link from 'next/link'
import { useContext } from 'react'
import { v2v3ProjectRoute } from 'utils/routes'

function SafeIcon() {
  const { isDarkMode } = useContext(ThemeContext)
  const { handle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const src = isDarkMode
    ? '/assets/icons/gnosis_od.svg'
    : '/assets/icons/gnosis_ol.svg'

  return (
    <Link href={`${v2v3ProjectRoute({ projectId, handle })}/safe`}>
      <a>
        <img src={src} alt="Safe" width={15} height={15} />
      </a>
    </Link>
  )
}

export function GnosisSafeBadge() {
  const { handle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  return (
    <Tooltip
      placement="bottom"
      title={
        <Trans>
          This project is owned by a Safe.{' '}
          <Link href={`${v2v3ProjectRoute({ projectId, handle })}/safe`}>
            See transactions
          </Link>
          .
        </Trans>
      }
    >
      <Icon component={SafeIcon} />
    </Tooltip>
  )
}
