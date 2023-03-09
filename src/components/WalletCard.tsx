import { Wallet } from 'models/subgraph-entities/vX/wallet'
import Link from 'next/link'
import { ensAvatarUrlForAddress } from 'utils/ens'
import { formatDate } from 'utils/format/formatDate'
import { formatWad } from 'utils/format/formatNumber'

import CurrencySymbol from './CurrencySymbol'
import FormattedAddress from './FormattedAddress'
import ProjectLogo from './ProjectLogo'

export default function WalletCard({
  wallet,
}: {
  wallet: Pick<Wallet, 'id' | 'lastPaidTimestamp' | 'totalPaid'>
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
        <div className="relative flex cursor-pointer items-center overflow-hidden whitespace-pre rounded-sm py-4 md:border md:border-solid md:border-smoke-300 md:py-6 md:px-5 md:transition-colors md:hover:border-smoke-500 md:dark:border-slate-300 md:dark:hover:border-slate-100">
          <div className="mr-5">
            <ProjectLogo
              uri={ensAvatarUrlForAddress(wallet.id, { size: 128 })}
              name={wallet.id}
            />
          </div>

          <div className="min-w-0 flex-1 font-normal">
            <h2 className="m-0 overflow-hidden overflow-ellipsis text-xl leading-8 text-black dark:text-slate-100">
              <FormattedAddress address={wallet.id} />
            </h2>

            <div className="font-medium text-black dark:text-slate-100">
              <CurrencySymbol currency="ETH" />
              {formatWad(wallet.totalPaid, { precision: 2 })} contributed
            </div>

            <div className="font-medium text-black dark:text-slate-100">
              Last payment {formatDate(wallet.lastPaidTimestamp * 1000)}
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}
