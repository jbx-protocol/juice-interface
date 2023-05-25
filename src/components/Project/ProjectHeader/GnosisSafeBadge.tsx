import Icon from '@ant-design/icons'
import { plural, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { useQueuedSafeTransactions } from 'hooks/safe/useQueuedSafeTransactions'
import { useWallet } from 'hooks/Wallet'
import { GnosisSafe } from 'models/safe'
import Link from 'next/link'
import {
  getUniqueNonces,
  getUnsignedTxsForAddress,
  isSafeSigner,
} from 'utils/safe'

function SafeIcon({ href }: { href: string }) {
  return (
    <Link href={href} className="text-current hover:text-bluebs-500">
      <svg
        viewBox="0 0 661.62 661.47"
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
      >
        <path
          d="m531.98 330.7h-49.42c-14.76 0-26.72 11.96-26.72 26.72v71.73c0 14.76-11.96 26.72-26.72 26.72h-196.61c-14.76 0-26.72 11.96-26.72 26.72v49.42c0 14.76 11.96 26.72 26.72 26.72h207.99c14.76 0 26.55-11.96 26.55-26.72v-39.65c0-14.76 11.96-25.23 26.72-25.23h38.2c14.76 0 26.72-11.96 26.72-26.72v-83.3c0-14.76-11.96-26.41-26.72-26.41zm-326.2-98.18c0-14.76 11.96-26.72 26.72-26.72h196.49c14.76 0 26.72-11.96 26.72-26.72v-49.42c0-14.76-11.96-26.72-26.72-26.72h-207.88c-14.76 0-26.72 11.96-26.72 26.72v38.08c0 14.76-11.96 26.72-26.72 26.72h-38.03c-14.76 0-26.72 11.96-26.72 26.72v83.39c0 14.76 12.01 26.12 26.77 26.12h49.42c14.76 0 26.72-11.96 26.72-26.72l-.05-71.44zm101.77 46.23h47.47c15.47 0 28.02 12.56 28.02 28.02v47.47c0 15.47-12.56 28.02-28.02 28.02h-47.47c-15.47 0-28.02-12.56-28.02-28.02v-47.47c0-15.47 12.56-28.02 28.02-28.02z"
          fill="currentColor"
        />
      </svg>
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
      <span className="flex">
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
      overlayClassName="w-2xl"
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
    <div className="absolute top-0 left-3 h-2 w-2 rounded-full bg-error-500 dark:bg-error-400" />
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
