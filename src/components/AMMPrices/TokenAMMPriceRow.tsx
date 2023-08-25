import { LoadingOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import SushiswapLogo from 'components/icons/Sushiswap'
import UniswapLogo from 'components/icons/Uniswap'
import { ONE_TRILLION } from 'constants/numbers'
import { classNames } from 'utils/classNames'
import { formatOrTruncate } from 'utils/format/formatNumber'

import ExternalLink from '../ExternalLink'

import TooltipIcon from '../TooltipIcon'

type ExchangeName = 'Uniswap' | 'Sushiswap'

const LOGOS = {
  Uniswap: UniswapLogo,
  Sushiswap: SushiswapLogo,
}

type Props = {
  className?: string
  exchangeName: ExchangeName
  tokenSymbol: string
  exchangeLink?: string
  WETHPrice?: string
  loading?: boolean
}

export default function TokenAMMPriceRow({
  className,
  exchangeName,
  tokenSymbol,
  exchangeLink,
  WETHPrice,
  loading,
}: Props) {
  const LogoComponent = LOGOS[exchangeName]

  const NotAvailableText = () => {
    const tooltip = !WETHPrice
      ? t`${exchangeName} has no market for ${tokenSymbol}.`
      : ''

    return (
      <Tooltip title={tooltip}>
        <span className="cursor-default">
          {!WETHPrice ? <Trans>Unavailable</Trans> : null}
          <TooltipIcon iconClassName="ml-1" />
        </span>
      </Tooltip>
    )
  }

  const formatPrice = (price: string) => {
    const p = parseInt(price, 10)
    const formatLimit = ONE_TRILLION

    // format all values below trillion value, otherwise truncate is as long number.
    return formatOrTruncate(p, formatLimit)
  }

  return (
    <div
      className={classNames(
        'flex items-center justify-between text-xs font-normal',
        className,
      )}
    >
      <div className="flex items-center">
        <span className="mr-2 w-4">
          <LogoComponent size={15} />
        </span>
        {exchangeName}
      </div>
      {loading && <LoadingOutlined />}

      {!loading &&
        (WETHPrice ? (
          <Tooltip
            title={t`${tokenSymbol}/ETH exchange rate on ${exchangeName}.`}
          >
            <ExternalLink className="font-normal" href={exchangeLink}>
              {`${formatPrice(WETHPrice)} ${tokenSymbol} per ETH`}
            </ExternalLink>
          </Tooltip>
        ) : (
          <NotAvailableText />
        ))}
    </div>
  )
}
