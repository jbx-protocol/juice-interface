import { CV_V2, CV_V3 } from 'constants/cv'
import { SafeTransactionType } from 'models/safe'
import { useLoadV2V3Contract } from 'packages/v2v3/hooks/useLoadV2V3Contract'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'
import { CV2V3 } from 'packages/v2v3/models/cv'

export function useTransactionVersion(
  transaction: SafeTransactionType,
): CV2V3 | undefined {
  const V2JBController = useLoadV2V3Contract({
    cv: CV_V2,
    contractName: V2V3ContractName.JBController,
  })
  const V3JBController = useLoadV2V3Contract({
    cv: CV_V3,
    contractName: V2V3ContractName.JBController,
  })

  // from ethers v5 to v6 migration: https://github.com/ethers-io/ethers.js/discussions/4312#discussioncomment-8398867
  if (transaction.to === V2JBController?.target) {
    return CV_V2
  }

  // from ethers v5 to v6 migration: https://github.com/ethers-io/ethers.js/discussions/4312#discussioncomment-8398867
  if (transaction.to === V3JBController?.target) {
    return CV_V3
  }
}
