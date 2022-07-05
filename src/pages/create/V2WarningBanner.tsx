import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { helpPagePath } from 'utils/helpPageHelper'
import useMobile from 'hooks/Mobile'

import { ThemeOption } from 'constants/theme/theme-option'

export default function V2WarningBanner() {
  const {
    theme: { colors },
    themeOption,
  } = useContext(ThemeContext)
  const isMobile = useMobile()

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
        marginTop: isMobile ? '2rem' : 0,
      }}
    >
      <InfoCircleOutlined />{' '}
      <Trans>
        Your project will be created on the Juicebox V2 contracts.{' '}
        <ExternalLink
          style={{
            color:
              themeOption === ThemeOption.dark
                ? colors.text.over.action.primary
                : colors.text.primary,
            fontWeight: 400,
            textDecoration: 'underline',
          }}
          href={helpPagePath('dev/build/basics')}
        >
          Learn more.
        </ExternalLink>
      </Trans>
    </div>
  )
}
