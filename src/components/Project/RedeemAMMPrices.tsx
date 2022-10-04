import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import AMMPrices from 'components/AMMPrices'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

export const RedeemAMMPrices = ({
  tokenSymbol,
  tokenAddress,
  style,
}: {
  tokenSymbol: string
  tokenAddress: string
  style?: CSSProperties
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <span style={style}>
      <Trans>
        or{' '}
        <Tooltip
          title={
            <AMMPrices
              mode="redeem"
              tokenSymbol={tokenSymbol}
              tokenAddress={tokenAddress}
            />
          }
          placement="bottomLeft"
          overlayStyle={{ minWidth: '300px' }}
        >
          <span
            style={{
              cursor: 'default',
              paddingTop: '0.5rem',
              paddingBottom: '1px',
              borderBottom: '1px dashed ' + colors.stroke.secondary,
            }}
          >
            sell {tokenSymbol} on exchange.
          </span>
        </Tooltip>
      </Trans>
    </span>
  )
}
