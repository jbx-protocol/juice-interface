import Icon from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import Link from 'next/link'
import { useContext } from 'react'

export function GnosisSafeBadge({ href }: { href: string }) {
  function SafeIcon() {
    const { isDarkMode } = useContext(ThemeContext)
    const src = isDarkMode
      ? '/assets/icons/gnosis_od.svg'
      : '/assets/icons/gnosis_ol.svg'

    return (
      <Link href={href}>
        <a>
          <img src={src} alt="Safe" width={15} height={15} />
        </a>
      </Link>
    )
  }

  return (
    <Tooltip
      placement="bottom"
      title={
        <Trans>
          This project is owned by a Safe.{' '}
          <Link href={href}>See transactions</Link>.
        </Trans>
      }
    >
      <Icon component={SafeIcon} />
    </Tooltip>
  )
}
