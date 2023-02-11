import {
  DEFAULT_ALLOW_OVERSPENDING,
  JB721DELAGATE_V1_1_PAY_METADATA,
  JB721DELAGATE_V1_PAY_METADATA
} from 'components/Project/PayProjectForm/hooks/PayProjectForm'
import { PayProjectFormContext } from 'components/Project/PayProjectForm/payProjectFormContext'
import {
  JB721_DELEGATE_V1,
  JB721_DELEGATE_V1_1
} from 'constants/delegateVersions'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useContext } from 'react'
import {
  encodeJB721DelegateV1PayMetadata,
  encodeJB721DelegateV1_1PayMetadata
} from 'utils/nftRewards'

export function useDelegateMetadata() {
  const {
    nftRewards: { contractVersion: nftContractVersion },
  } = useContext(NftRewardsContext)
  const { form: payProjectForm } = useContext(PayProjectFormContext)

  return nftContractVersion === JB721_DELEGATE_V1
    ? encodeJB721DelegateV1PayMetadata({
        ...(payProjectForm?.payMetadata as JB721DELAGATE_V1_PAY_METADATA),
      })
    : nftContractVersion === JB721_DELEGATE_V1_1
    ? encodeJB721DelegateV1_1PayMetadata({
        ...(payProjectForm?.payMetadata as JB721DELAGATE_V1_1_PAY_METADATA),
        allowOverspending: DEFAULT_ALLOW_OVERSPENDING,
      })
    : undefined
}
