import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'
import ETHAmount from 'components/currency/ETHAmount'

export function NftCreditsSection({ credits }: { credits: bigint }) {
  return (
    <>
      <div className="text-sm font-medium text-grey-600 dark:text-slate-50">
        <Trans>Your credits</Trans>
      </div>
      <div className="font-heading text-xl font-medium dark:text-slate-50">
        {/* // TODO: make ETHAmount take BigInts */}
        <ETHAmount amount={BigNumber.from(credits)} /> credits{' '}
        <TooltipIcon
          tip={
            <Trans>
              You have NFT credits from previous payments. Select NFTs to mint
              and use your credits.
            </Trans>
          }
        />
      </div>
    </>
  )
}
