import { LoadingOutlined } from '@ant-design/icons'
import { useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'
import { formattedNum } from 'utils/formatNumber'
import UniswapLogo from 'components/icons/Uniswap'
import { Tooltip } from 'antd'
import { t } from '@lingui/macro'
import { Price, Token } from '@uniswap/sdk-core'

type ExchangeName = 'Uniswap'

const LOGOS = {
  Uniswap: UniswapLogo,
}

type Props = {
  exchangeName: ExchangeName
  tokenSymbol: string
  exchangeLink: string
  WETHPrice?: Price<Token, Token>
  loading?: boolean
}

export default function TokenAMMPriceBadge({
  exchangeName,
  tokenSymbol,
  exchangeLink,
  WETHPrice,
  loading,
}: Props) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const LogoComponent = LOGOS[exchangeName]

  const hasAMMPrice = Boolean(WETHPrice)

  return (
    <Tooltip
      title={
        loading
          ? t`Loading ${exchangeName} price for ${tokenSymbol}...`
          : hasAMMPrice
          ? t`${tokenSymbol}/ETH exchange rate on ${exchangeName}.`
          : t`${exchangeName} has no liquidity pool for ${tokenSymbol}.`
      }
      placement="topLeft"
    >
      <a
        className="quiet"
        href={exchangeLink}
        rel="noopener noreferrer"
        target="_blank"
        style={{
          padding: '0 0.5rem',
          borderRadius: 100,
          border: `1px solid ${colors.stroke.secondary}`,
          fontSize: '0.7rem',
          fontWeight: 400,
          display: 'inline-flex',
          alignItems: 'center',
          filter: !loading && !hasAMMPrice ? 'grayscale(100%)' : undefined,
        }}
      >
        <span style={{ marginRight: '0.25rem' }}>
          <LogoComponent size={20} />
        </span>
        {loading && <LoadingOutlined />}

        {!loading &&
          WETHPrice &&
          `${formattedNum(WETHPrice.toFixed(0))} ${tokenSymbol}/ETH`}
      </a>
    </Tooltip>
  )
}
