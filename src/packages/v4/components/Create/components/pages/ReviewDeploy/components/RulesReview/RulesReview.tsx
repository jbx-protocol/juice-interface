import EthereumAddress from 'components/EthereumAddress'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { JBChainId } from 'juice-sdk-core'
import { ReviewDescription } from '../ReviewDescription'
import { featureFlagEnabled } from 'utils/featureFlags'
import { t } from '@lingui/macro'
import { useChainId } from 'wagmi'
import { useRulesReview } from './hooks/useRulesReview'

export const RulesReview = () => {
  const {
    customAddress,
    pausePayments,
    strategy,
    terminalConfiguration,
    controllerConfiguration,
    terminalMigration,
    controllerMigration,
    holdFees,
    ofac,
  } = useRulesReview()
  const chainId = useChainId()

  return (
    <div className="flex flex-col gap-x-5 gap-y-10 pt-5 pb-8 md:grid md:grid-cols-4">
      <ReviewDescription
        title={t`Rule change deadline`}
        desc={
          <div className="text-base font-medium">
            {strategy ? (
              strategy
            ) : customAddress ? (
              <EthereumAddress
                address={customAddress}
                chainId={chainId as JBChainId}
              />
            ) : (
              '??'
            )}
          </div>
        }
      />
      <ReviewDescription
        title={t`Payments to this project`}
        desc={<div className="text-base font-medium">{pausePayments}</div>}
      />
      <ReviewDescription
        className="col-span-2"
        title={t`Hold fees`}
        desc={<div className="text-base font-medium">{holdFees}</div>}
      />
      <ReviewDescription
        title={t`Terminal configuration`}
        desc={
          <div className="text-base font-medium">{terminalConfiguration}</div>
        }
      />
      <ReviewDescription
        title={t`Controller configuration`}
        desc={
          <div className="text-base font-medium">{controllerConfiguration}</div>
        }
      />
      <ReviewDescription
        title={t`Terminal migration`}
        desc={<div className="text-base font-medium">{terminalMigration}</div>}
      />
      <ReviewDescription
        title={t`Controller migration`}
        desc={
          <div className="text-base font-medium">{controllerMigration}</div>
        }
      />
      {/* {featureFlagEnabled(FEATURE_FLAGS.OFAC) ? ( */}
      <ReviewDescription
        title={t`OFAC Sanctions screening`}
        desc={<div className="text-base font-medium">{ofac}</div>}
      />
      {/* ) : null} */}
    </div>
  )
}
