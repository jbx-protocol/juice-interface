import { Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'

export default function TokenMintingExtra({
  showMintingWarning,
}: {
  showMintingWarning: boolean
}) {
  const { theme } = useContext(ThemeContext)
  return (
    <>
      <Trans>
        When enabled, the project owner can manually mint any amount of tokens
        to any address.
      </Trans>
      {showMintingWarning && (
        <div style={{ color: theme.colors.text.warn, marginTop: 10 }}>
          <InfoCircleOutlined />{' '}
          <Trans>
            Enabling token minting will appear risky to contributors. Only
            enable this when necessary.
          </Trans>
        </div>
      )}
    </>
  )
}
