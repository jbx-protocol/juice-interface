import Icon from '@ant-design/icons'
import { plural, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useQueuedSafeTransactions } from 'hooks/safe/QueuedSafeTransactions'
import { useWallet } from 'hooks/Wallet'
import { GnosisSafe } from 'models/safe'
import Link from 'next/link'
import { useContext } from 'react'
import {
  getUniqueNonces,
  getUnsignedTxsForAddress,
  isSafeSigner,
} from 'utils/safe'

function SafeIcon({ href }: { href: string }) {
  const { isDarkMode } = useContext(ThemeContext)
  const src = isDarkMode
    ? '/assets/icons/gnosis_od.svg'
    : '/assets/icons/gnosis_ol.svg'

  return (
    <Link href={href}>
      <a>
        <img src={src} alt="Safe" width={15} height={15} />
      </a>
    </Link>
  )
}

// Badge with no notice about unsigned transactions
function DefaultBadge({ href }: { href: string }) {
  return (
    <Tooltip
      placement="bottom"
      title={
        <Trans>
          This project is owned by a Safe.{' '}
          <Link href={href}>View transactions</Link>.
        </Trans>
      }
    >
      <span>
        <SafeIcon href={href} />
      </span>
    </Tooltip>
  )
}

// This shows a notice of queued transaction count to users with connected wallets on the multisig
// Using this component so `useQueuedSafeTransactions` is only called when the connected wallet is on the multisig
function BadgeMightHaveNotice({
  safe,
  href,
}: {
  safe: GnosisSafe
  href: string
}) {
  const { userAddress } = useWallet()
  const { data: queuedSafeTransactions, isLoading } = useQueuedSafeTransactions(
    {
      safeAddress: safe.address,
    },
  )

  if (isLoading || !userAddress) {
    return <DefaultBadge href={href} />
  }

  const unsignedNoncesOfUser = getUniqueNonces(
    getUnsignedTxsForAddress({
      address: userAddress,
      transactions: queuedSafeTransactions,
    }),
  )
  if (queuedSafeTransactions && !unsignedNoncesOfUser.length) {
    return <DefaultBadge href={href} />
  }
  return (
    <Tooltip
      overlayClassName="w-[700px]"
      placement="bottom"
      title={
        <>
          <div>
            <Trans>
              {plural(unsignedNoncesOfUser.length, {
                one: '# transaction needs your signature',
                other: '# transactions need your signature',
              })}
              .{' '}
            </Trans>
          </div>
          <div>
            <Trans>
              <Link href={href}>View transactions.</Link>
            </Trans>
          </div>
        </>
      }
    >
      <div className="relative flex">
        <Icon component={() => <SafeIcon href={href} />} />
        <Notice />
      </div>
    </Tooltip>
  )
}

// Red dot that appears conditionally next to Safe badge when connected user is on multisig and has unsiged tranctions
function Notice() {
  return (
    <div className="absolute top-0 left-3 h-4 w-1 rounded-full bg-error-500 dark:bg-error-400" />
  )
}

export function GnosisSafeBadge({
  safe,
  href,
}: {
  safe: GnosisSafe
  href: string
}) {
  const { userAddress } = useWallet()

  const isMultisigMember = isSafeSigner({ safe, address: userAddress })
  if (isMultisigMember) {
    return <BadgeMightHaveNotice safe={safe} href={href} />
  }

  return <DefaultBadge href={href} />
}
