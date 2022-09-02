import { LoadingOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import SushiswapLogo from 'components/icons/Sushiswap'
import UniswapLogo from 'components/icons/Uniswap'
import { CSSProperties } from 'react'
import { formattedNum } from 'utils/formatNumber'
import { truncateString } from 'utils/formatString'

import ExternalLink from '../ExternalLink'

import TooltipIcon from '../TooltipIcon'

type ExchangeName = 'Uniswap' | 'Sushiswap'

const LOGOS = {
  Uniswap: UniswapLogo,
  Sushiswap: SushiswapLogo,
}

type Props = {
  exchangeName: ExchangeName
  tokenSymbol: string
  exchangeLink?: string
  WETHPrice?: string
  loading?: boolean
  style?: CSSProperties
}

const fontStyle = {
  fontSize: '0.7rem',
  fontWeight: 400,
}

export default function TokenAMMPriceRow({
  exchangeName,
  tokenSymbol,
  exchangeLink,
  WETHPrice,
  loading,
  style,
}: Props) {
  const LogoComponent = LOGOS[exchangeName]

  const NotAvailableText = () => {
    const tooltip = !WETHPrice
      ? t`${exchangeName} has no market for ${tokenSymbol}.`
      : ''

    return (
      <Tooltip title={tooltip} overlayInnerStyle={{ ...fontStyle }}>
        <span style={{ cursor: 'default' }}>
          {!WETHPrice ? <Trans>Unavailable</Trans> : null}
          <TooltipIcon iconStyle={{ marginLeft: '0.2rem' }} />
        </span>
      </Tooltip>
    )
  }

  const preparePrice = (price: string) => {
    const formattedPrice = formattedNum(price) ?? ''

    return truncateString(formattedPrice, 15)
  }

  return (
    <div
      style={{
        ...fontStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '0.5rem', width: '1rem' }}>
          <LogoComponent size={15} />
        </span>
        {exchangeName}
      </div>
      {loading && <LoadingOutlined />}

      {!loading &&
        (WETHPrice ? (
          <Tooltip
            title={t`${tokenSymbol}/ETH exchange rate on ${exchangeName}.`}
            overlayInnerStyle={{ ...fontStyle }}
          >
            <ExternalLink href={exchangeLink} style={{ fontWeight: 400 }}>
              {`${preparePrice(WETHPrice)} ${tokenSymbol}/1 ETH`}
            </ExternalLink>
          </Tooltip>
        ) : (
          <NotAvailableText />
        ))}
    </div>
  )
}
