import { LinkIcon } from '@heroicons/react/24/outline'
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
          'text-grey-900 hover:text-bluebs-500 hover:underline dark:text-slate-100',
          className,
        )}
        href={etherscanLink(type, value)}
        onClick={onClick}
      >
        {children} <LinkIcon className="inline h-3 w-3" />
      </ExternalLink>
    )
  }

  return (
    <ExternalLink
      className={twMerge(
        'text-grey-900 hover:text-bluebs-500 hover:underline dark:text-slate-100',
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
