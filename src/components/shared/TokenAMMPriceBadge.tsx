import { LoadingOutlined } from '@ant-design/icons'
import { useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'
import { useUniswapPriceQuery } from 'hooks/ERC20UniswapPrice'
import { formattedNum } from 'utils/formatNumber'
import UniswapLogo from 'components/icons/Uniswap'
import { Tooltip } from 'antd'

type exchangeName = 'Uniswap'

const LOGOS = {
  Uniswap: UniswapLogo,
}

const QUERIES = {
  Uniswap: useUniswapPriceQuery,
}

type Props = {
  exchangeName: exchangeName
  tokenSymbol: string
  tokenAddress: string
  exchangeLink: string
}

export default function TokenAMMPriceBadge({
  exchangeName,
  tokenSymbol,
  tokenAddress,
  exchangeLink,
}: Props) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const Logo = LOGOS[exchangeName]
  const query = QUERIES[exchangeName]

  const { data: priceData, isLoading } = query({
    tokenSymbol,
    tokenAddress,
  })

  const { WETHPrice } = priceData || {}
  const hasAMMPrice = Boolean(WETHPrice)

  return (
    <Tooltip
      title={
        isLoading
          ? `Loading ${exchangeName} price for ${tokenSymbol}...`
          : hasAMMPrice
          ? `${tokenSymbol}/ETH exchange rate on ${exchangeName}.`
          : `${exchangeName} has no liquidity pool for ${tokenSymbol}.`
      }
    >
      <a
        className="quiet"
        href={exchangeLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span
          style={{
            padding: '0 0.5rem',
            borderRadius: 100,
            border: `1px solid ${colors.stroke.secondary}`,
            fontSize: '0.7rem',
            fontWeight: 400,
            display: 'inline-flex',
            alignItems: 'center',
            filter: !isLoading && !hasAMMPrice ? 'grayscale(100%)' : undefined,
          }}
        >
          <span style={{ marginRight: '0.25rem' }}>
            <Logo size={20} />
          </span>
          {isLoading && <LoadingOutlined />}

          {!isLoading &&
            WETHPrice &&
            `${formattedNum(WETHPrice.toFixed(0))} ${tokenSymbol}/ETH`}
        </span>
      </a>
    </Tooltip>
  )
}
