import { Wallet } from 'models/subgraph-entities/vX/wallet'
import Link from 'next/link'
import { ensAvatarUrlForAddress } from 'utils/ens'
import { formatWad } from 'utils/format/formatNumber'

import CurrencySymbol from './CurrencySymbol'
import FormattedAddress from './FormattedAddress'

export default function WalletCard({
  wallet,
  rank,
}: {
  wallet: Pick<Wallet, 'id' | 'totalPaid'>
  rank?: number
}) {
  /**
   * We need to set the `as` prop for V2V3 projects
   * so that NextJs's prefetching works.
   *
   * The `href` prop will always be the project ID route,
   * but if there is a handle, we use that as the `as` prop
   * for pretty URLs.
   *
   * https://web.dev/route-prefetching-in-nextjs/
   */
  const walletCardHref = `/account/${wallet.id}`

  const walletCardUrl = `/account/${wallet.id}`

  return (
    <Link href={walletCardHref} as={walletCardUrl}>
      <a>
        <div className="flex cursor-pointer items-center justify-between gap-4 overflow-hidden whitespace-pre rounded-sm py-4">
          <div className="flex flex-1 items-center gap-4">
            {rank !== undefined && (
              <div className="text-xl font-bold leading-8 text-black dark:text-slate-100">
                {rank}
              </div>
            )}

            <img
              src={ensAvatarUrlForAddress(wallet.id, { size: 64 })}
              className="h-7 w-7 rounded-full"
              alt={`Avatar for ${wallet.id}`}
              loading="lazy"
            />

            <h2 className="m-0 overflow-hidden overflow-ellipsis text-lg leading-8 text-black dark:text-slate-100">
              <FormattedAddress address={wallet.id} />
            </h2>
          </div>

          <div className="text-xl font-medium text-black dark:text-slate-100">
            <CurrencySymbol currency="ETH" />
            {formatWad(wallet.totalPaid, { precision: 2 })}
          </div>

          {/* <div className="text-xs font-medium text-black dark:text-slate-100">
            Last payment {formatDate(wallet.lastPaidTimestamp * 1000)}
          </div> */}
        </div>
      </a>
    </Link>
  )
}
