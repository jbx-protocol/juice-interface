import { LinkIcon } from '@heroicons/react/24/outline'
import { MouseEventHandler } from 'react'
import { twMerge } from 'tailwind-merge'
import { etherscanLink } from 'utils/etherscan'
import { truncateEthAddress } from 'utils/format/formatAddress'
import ExternalLink from './ExternalLink'

const EtherscanLink: React.FC<
  React.PropsWithChildren<{
    className?: string
    value: string | undefined
    type: 'tx' | 'address'
    truncated?: boolean
    truncateTo?: number
    onClick?: MouseEventHandler
  }>
> = ({ className, value, type, truncated, truncateTo, children, onClick }) => {
  if (!value) return null

  const renderValue = truncated
    ? truncateEthAddress({ address: value, truncateTo })
    : value

  return (
    <ExternalLink
      className={twMerge(
        'text-current hover:text-bluebs-500 hover:underline',
        className,
      )}
      href={etherscanLink(type, value)}
      onClick={onClick}
    >
      {type === 'tx' ? (
        <>
          {children}{' '}
          <LinkIcon className="inline h-4 w-4 text-grey-600 dark:text-slate-200" />
        </>
      ) : (
        <> {children ?? renderValue}</>
      )}
    </ExternalLink>
  )
}

export default EtherscanLink
