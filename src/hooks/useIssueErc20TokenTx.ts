import { IssueErc20TokenTxArgs } from 'components/buttons/IssueErc20TokenButton'
import { CV_V2, CV_V3 } from 'constants/cv'
import { TransactorInstance } from 'hooks/useTransactor'
import { useV1IssueErc20TokenTx } from 'packages/v1/hooks/transactor/useIssueErc20TokenTx'
import { useV2IssueErc20TokenTx } from 'packages/v2/hooks/transactor/useV2IssueErc20TokenTx'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { useV3IssueErc20TokenTx } from 'packages/v3/hooks/transactor/useV3IssueErc20TokenTx'
import { useContext } from 'react'

/**
 * Return the appropriate issue erc20 token hook for the given project version [pv].
 * @returns
 */
export const useIssueErc20TokenTx = ():
  | TransactorInstance<IssueErc20TokenTxArgs>
  | undefined => {
  const { cv } = useContext(V2V3ContractsContext)

  const v1Tx = useV1IssueErc20TokenTx()
  const v2Tx = useV2IssueErc20TokenTx()
  const v3Tx = useV3IssueErc20TokenTx()

  if (cv === CV_V2) {
    return v2Tx
  } else if (cv === CV_V3) {
    return v3Tx
  } else {
    return v1Tx
  }
}
