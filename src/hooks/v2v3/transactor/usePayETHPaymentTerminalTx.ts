import { t } from '@lingui/macro'
import { useProjectIsOFACListed } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectIsOFACListed'
import { DEFAULT_MIN_RETURNED_TOKENS } from 'constants/transactionDefaults'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { BigNumber } from 'ethers'
import { TransactorInstance } from 'hooks/useTransactor'
import { useContext } from 'react'
import { useV2V3BlockedProject } from '../useBlockedProject'
import { useV2ProjectTitle } from '../useProjectTitle'

const DEFAULT_DELEGATE_METADATA = 0

type PayV2ProjectTx = TransactorInstance<{
  memo: string
  preferClaimedTokens: boolean
  value: BigNumber
  beneficiary?: string
  delegateMetadata?: string
}>

export function usePayETHPaymentTerminalTx(): PayV2ProjectTx {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ProjectContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()

  // Blocked project
  const isBlockedProject = useV2V3BlockedProject()
  // OFAC Compliance
  const { isAddressListedInOFAC, isLoading: isOFACLoading } =
    useProjectIsOFACListed()

  return (
    { memo, preferClaimedTokens, beneficiary, value, delegateMetadata },
    txOpts,
  ) => {
    if (
      !transactor ||
      !projectId ||
      !contracts?.JBETHPaymentTerminal ||
      !beneficiary
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    if (isBlockedProject) {
      txOpts?.onError?.(
        new Error(t`This project has been delisted and can't be paid.`),
      )
      return Promise.resolve(false)
    }
    if (isOFACLoading) {
      txOpts?.onError?.(
        new Error(t`Compliance check is in progress. Please try again shortly`),
      )
      return Promise.resolve(false)
    }
    if (isAddressListedInOFAC) {
      txOpts?.onError?.(
        new Error(
          t`You can't pay this project because your wallet address failed a compliance check set up by the project owner.`,
        ),
      )
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBETHPaymentTerminal,
      'pay',
      [
        projectId,
        value,
        ETH_TOKEN_ADDRESS,
        beneficiary,
        DEFAULT_MIN_RETURNED_TOKENS, // minReturnedTokens
        preferClaimedTokens, // _preferClaimedTokens
        memo || '',
        delegateMetadata ?? DEFAULT_DELEGATE_METADATA, // _metadata
      ],
      {
        ...txOpts,
        value,
        title: t`Pay ${projectTitle}`,
      },
    )
  }
}
