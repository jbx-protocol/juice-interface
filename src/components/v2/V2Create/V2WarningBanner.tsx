import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'

import { ThemeOption } from 'constants/theme/theme-option'

export default function V2WarningBanner() {
  const {
    theme: { colors },
    themeOption,
  } = useContext(ThemeContext)
  return (
    <div
      style={{
        background: colors.background.brand.primary,
        padding: '0.5rem',
        textAlign: 'center',
        color:
          themeOption === ThemeOption.dark
            ? colors.text.over.action.primary
            : '',
      }}
    >
      <InfoCircleOutlined />{' '}
      <Trans>Your project will be created on the Juicebox V2 contracts.</Trans>
    </div>
  )
}
