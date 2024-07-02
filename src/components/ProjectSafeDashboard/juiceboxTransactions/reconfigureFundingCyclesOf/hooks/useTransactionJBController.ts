import { CV_V2, CV_V3 } from 'constants/cv'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { useLoadV2V3Contract } from 'hooks/v2v3/useLoadV2V3Contract'
import { SafeTransactionType } from 'models/safe'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'

export function useTransactionJBController(transaction: SafeTransactionType) {
  const { contracts } = useContext(V2V3ContractsContext)

  const V2JBController = useLoadV2V3Contract({
    cv: CV_V2,
    contractName: V2V3ContractName.JBController,
  })
  const V3JBController = useLoadV2V3Contract({
    cv: CV_V3,
    contractName: V2V3ContractName.JBController,
  })

  if (!contracts) return

  switch (transaction.to) {
    // from ethers v5 to v6 migration: https://github.com/ethers-io/ethers.js/discussions/4312#discussioncomment-8398867
    case contracts?.JBController3_1.target as string:
      return contracts.JBController3_1
    // from ethers v5 to v6 migration: https://github.com/ethers-io/ethers.js/discussions/4312#discussioncomment-8398867
    case V2JBController?.target as string:
      return V2JBController

    // from ethers v5 to v6 migration: https://github.com/ethers-io/ethers.js/discussions/4312#discussioncomment-8398867
    case V3JBController?.target as string:
      return V3JBController
  }
}
