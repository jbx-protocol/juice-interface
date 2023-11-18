import { Trans } from '@lingui/macro'
import {
  PayProjectModalFormValues,
  usePayProjectModal,
} from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/usePayProjectModal/usePayProjectModal'
import { useProjectPaymentTokens } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectPaymentTokens'
import { useFormikContext } from 'formik'
import { EditRewardBeneficiary } from './EditRewardBeneficiary'
import { ReceiveNftItem } from './ReceiveNftItem'
import { ReceiveTokensItem } from './ReceiveTokensItem'

export const ReceiveSection = ({ className }: { className?: string }) => {
  const { nftRewards } = usePayProjectModal()
  const { receivedTickets } = useProjectPaymentTokens()
  const { values, setFieldValue } =
    useFormikContext<PayProjectModalFormValues>()

  if (nftRewards.length === 0 && receivedTickets === '0') {
    return null
  }

  return (
    <div className={className}>
      <span className="font-medium">
        <Trans>Receive</Trans>
      </span>
      <div className="mt-2 flex justify-between gap-3">
        <span className="text-grey-500 dark:text-slate-200">
          <Trans>
            NFTs, tokens and rewards will be sent to{' '}
            <EditRewardBeneficiary
              className="ml-2"
              value={values.beneficiaryAddress}
              onChange={address => setFieldValue('beneficiaryAddress', address)}
            />
          </Trans>
        </span>
      </div>
      <ReceiveTokensItem className="mt-5" />
      {nftRewards.map(nftReward => (
        <ReceiveNftItem
          key={nftReward.id}
          nftReward={nftReward}
          className="mt-5"
        />
      ))}
    </div>
  )
}
