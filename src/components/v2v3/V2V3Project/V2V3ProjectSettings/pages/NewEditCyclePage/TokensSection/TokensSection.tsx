import { Trans } from '@lingui/macro'
import { EditCycleHeader } from '../EditCycleHeader'
import { MintRateField } from './MintRateField'
import { TokensSectionAdvanced } from './TokensSectionAdvanced'

export function TokensSection() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <EditCycleHeader
          title={<Trans>Total issuance</Trans>}
          description={
            <Trans>
              Enter a number of tokens that your project contributors will
              receive when they pay your project. You can use these tokens for
              governance rights, community access, or other perks such as ETH
              redemption.
            </Trans>
          }
        />
        <MintRateField />
      </div>
      <TokensSectionAdvanced />
    </>
  )
}
