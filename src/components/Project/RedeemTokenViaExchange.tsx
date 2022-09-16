import React, { CSSProperties, useContext } from 'react'
import { Tooltip } from 'antd'
import AMMPrices from 'components/AMMPrices'
import { ThemeContext } from 'contexts/themeContext'

export const RedeemTokenViaExchange = ({
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
      <Tooltip
        placement="bottom"
        title={
          <AMMPrices tokenSymbol={tokenSymbol} tokenAddress={tokenAddress} />
        }
      >
        <span
          style={{
            cursor: 'default',
            paddingTop: '0.5rem',
            paddingBottom: '1px',
            borderBottom: '1px dashed' + colors.stroke.secondary,
          }}
        >
          Redeem {tokenSymbol} on exchange.
        </span>
      </Tooltip>
    </span>
  )
}
