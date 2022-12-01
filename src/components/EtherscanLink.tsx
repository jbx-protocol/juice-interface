import { LinkOutlined } from '@ant-design/icons'
import { MouseEventHandler } from 'react'
import { twMerge } from 'tailwind-merge'
import { etherscanLink } from 'utils/etherscan'
import { truncateEthAddress } from 'utils/format/formatAddress'
import ExternalLink from './ExternalLink'

const EtherscanLink: React.FC<{
  className?: string
  value: string | undefined
  type: 'tx' | 'address'
  truncated?: boolean
  truncateTo?: number
  onClick?: MouseEventHandler
}> = ({ className, value, type, truncated, truncateTo, children, onClick }) => {
  if (!value) return null
  let truncatedValue: string | undefined
  // Return first and last 4 chars of ETH address only
  if (truncated) {
    truncatedValue = truncateEthAddress({ address: value, truncateTo })
  }

  if (type === 'tx') {
    return (
      <ExternalLink
        className={twMerge(
          'text-grey-700 hover:text-haze-400 hover:underline dark:text-slate-100',
          className,
        )}
        href={etherscanLink(type, value)}
        onClick={onClick}
      >
        {children} <LinkOutlined />
      </ExternalLink>
    )
  }

  return (
    <ExternalLink
      className={twMerge(
        'text-grey-700 hover:text-haze-400 hover:underline dark:text-slate-100',
        className,
      )}
      href={etherscanLink(type, value)}
      onClick={onClick}
    >
      {children ?? truncatedValue ?? value}
    </ExternalLink>
  )
}

export default EtherscanLink
