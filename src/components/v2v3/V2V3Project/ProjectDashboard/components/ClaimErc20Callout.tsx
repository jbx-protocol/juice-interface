import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { Callout } from 'components/Callout/Callout'
import { TokenAmount } from 'components/TokenAmount'
import { BigNumber } from 'ethers'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { reloadWindow } from 'utils/windowUtils'
import { V2V3ClaimTokensModal } from '../../V2V3ManageTokensSection/AccountBalanceDescription/V2V3ClaimTokensModal'
import { useProjectContext } from '../hooks/useProjectContext'

type ClaimErc20CalloutProps = {
  className?: string
  unclaimed: BigNumber
}
export const ClaimErc20Callout: React.FC<ClaimErc20CalloutProps> = ({
  className,
  unclaimed,
}) => {
  const [claimTokensModalVisible, setClaimTokensModalVisible] = useState(false)
  const { tokenSymbol } = useProjectContext()

  const ticker = tokenSymbol || 'TOKENS'
  return (
    <>
      <Callout.Info
        noIcon
        className={twMerge(
          'border border-grey-200 bg-white shadow-[0_6px_16px_0_rgba(0,_0,_0,_0.04)] dark:border-slate-600 dark:bg-slate-900',
          className,
        )}
      >
        <div className="flex w-full flex-col">
          <div>
            <InformationCircleIcon className="mr-2 inline h-6 w-6 text-split-700 dark:text-split-400" />
            <span>
              <Trans>
                You have{' '}
                <TokenAmount
                  className="font-medium"
                  amountWad={unclaimed ?? BigNumber.from(0)}
                  tokenSymbol=""
                />{' '}
                unclaimed {ticker} tokens.
              </Trans>
            </span>
          </div>
          <Button
            type="primary"
            className="mt-4 border-0 bg-bluebs-50 text-bluebs-700 hover:bg-bluebs-100 hover:text-bluebs-800 dark:bg-bluebs-900 dark:text-bluebs-50 dark:hover:bg-bluebs-800 dark:hover:text-bluebs-100"
            onClick={() => setClaimTokensModalVisible(true)}
          >
            <Trans>Claim {ticker} tokens</Trans>
          </Button>
        </div>
      </Callout.Info>

      <V2V3ClaimTokensModal
        open={claimTokensModalVisible}
        onCancel={() => setClaimTokensModalVisible(false)}
        onConfirmed={reloadWindow}
      />
    </>
  )
}
