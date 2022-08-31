import Icon from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

const SafeIcon = () => {
  const { isDarkMode } = useContext(ThemeContext)
  const src = isDarkMode
    ? '/assets/icons/gnosis_od.svg'
    : '/assets/icons/gnosis_ol.svg'

  return <img src={src} alt="Gnosis Safe" width={15} height={15} />
}

export function GnosisSafeBadge() {
  return (
    <Tooltip
      placement="bottom"
      title={t`This project is owned by a Gnosis Safe.`}
    >
      <Icon component={SafeIcon} />
    </Tooltip>
  )
}
