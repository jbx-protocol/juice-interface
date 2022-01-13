import {
  LoadingOutlined,
  LinkOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { CSSProperties } from 'react'
import { formattedNum } from 'utils/formatNumber'
import UniswapLogo from 'components/icons/Uniswap'
import { t, Trans } from '@lingui/macro'
import SushiswapLogo from 'components/icons/Sushiswap'
import { Tooltip } from 'antd'

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
  exchangeSupported?: boolean
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
  exchangeSupported = true,
  style,
}: Props) {
  const LogoComponent = LOGOS[exchangeName]

  const NotAvailableText = () => {
    const tooltip = !exchangeSupported
      ? t`Juicebox doesn't support ${exchangeName} yet.`
      : !WETHPrice
      ? t`${exchangeName} has no market for ${tokenSymbol}.`
      : ''

    return (
      <Tooltip title={tooltip} overlayInnerStyle={{ ...fontStyle }}>
        <span style={{ cursor: 'default' }}>
          {!exchangeSupported ? (
            <Trans>Not supported</Trans>
          ) : !WETHPrice ? (
            <Trans>No liquidity</Trans>
          ) : null}
          <InfoCircleOutlined style={{ marginLeft: '0.2rem' }} />
        </span>
      </Tooltip>
    )
  }

  return (
    <div
      style={{
        ...fontStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: exchangeSupported ? '100%' : '60%',
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
        (exchangeSupported && WETHPrice ? (
          <Tooltip
            title={t`${tokenSymbol}/ETH exchange rate on ${exchangeName}.`}
            overlayInnerStyle={{ ...fontStyle }}
          >
            <a
              href={exchangeLink}
              rel="noopener noreferrer"
              target="_blank"
              style={{ fontWeight: 400 }}
            >
              {`${formattedNum(WETHPrice)} ${tokenSymbol}/ETH`}
              <LinkOutlined style={{ marginLeft: '0.2rem' }} />
            </a>
          </Tooltip>
        ) : (
          <NotAvailableText />
        ))}
    </div>
  )
}
