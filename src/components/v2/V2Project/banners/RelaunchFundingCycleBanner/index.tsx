import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useContext, useState } from 'react'

import Banner from 'components/shared/Banner'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import TransactionModal from 'components/shared/TransactionModal'
import {
  V2FundAccessConstraint,
  V2FundingCycleData,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'
import { V2UserContext } from 'contexts/v2/userContext'
import { BigNumber } from '@ethersproject/bignumber'
import useProjectTerminals from 'hooks/v2/contractReader/ProjectTerminals'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import useProjectCurrentFundingCycle from 'hooks/v2/contractReader/ProjectCurrentFundingCycle'
import useProjectSplits from 'hooks/v2/contractReader/ProjectSplits'
import { useLaunchFundingCyclesTx } from 'hooks/v2/transactor/LaunchFundingCyclesTx'

import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/v2/splits'
import ReconfigurePreview from '../../V2ProjectReconfigureModal/ReconfigurePreview'
import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'

export default function RelaunchFundingCycleBanner() {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [transactionPending, setTransactionPending] = useState<boolean>(false)
  const { projectId } = useContext(V2ProjectContext)
  const { contracts } = useContext(V2UserContext)

  const { data, loading: deprecatedFundingCycleLoading } =
    useProjectCurrentFundingCycle({
      projectId,
      useDeprecatedContract: true,
    })
  const [deprecatedFundingCycle, deprecatedFundingCycleMetadata] = data ?? []

  const { data: deprecatedPayoutSplits, loading: payoutSplitsLoading } =
    useProjectSplits({
      projectId,
      splitGroup: ETH_PAYOUT_SPLIT_GROUP,
      domain: deprecatedFundingCycle?.configuration?.toString(),
      useDeprecatedContract: true,
    })
  const { data: deprecatedTokenSplits, loading: tokenSplitsLoading } =
    useProjectSplits({
      projectId,
      splitGroup: RESERVED_TOKEN_SPLIT_GROUP,
      domain: deprecatedFundingCycle?.configuration?.toString(),
      useDeprecatedContract: true,
    })

  const { data: terminals } = useProjectTerminals({
    projectId,
    useDeprecatedContract: true,
  })
  const primaryTerminal = terminals?.[0]

  const { data: distributionLimitData, loading: distributionLimitLoading } =
    useProjectDistributionLimit({
      projectId,
      configuration: deprecatedFundingCycle?.configuration?.toString(),
      terminal: primaryTerminal,
      useDeprecatedContract: true,
    })

  const [deprecatedDistributionLimit, deprecatedDistributionLimitCurrency] =
    distributionLimitData ?? []

  const deprecatedFundAccessConstraint: V2FundAccessConstraint = {
    terminal: contracts?.JBETHPaymentTerminal.address ?? '',
    token: ETH_TOKEN_ADDRESS,
    distributionLimit: deprecatedDistributionLimit,
    distributionLimitCurrency: deprecatedDistributionLimitCurrency,
    overflowAllowance: BigNumber.from(0), // nothing for the time being.
    overflowAllowanceCurrency: BigNumber.from(0),
  }

  const launchFundingCycleTx = useLaunchFundingCyclesTx()

  const loading =
    payoutSplitsLoading ||
    deprecatedFundingCycleLoading ||
    tokenSplitsLoading ||
    distributionLimitLoading

  if (
    !projectId ||
    !deprecatedFundingCycle ||
    !deprecatedFundingCycleMetadata
  ) {
    return null
  }

  const onLaunchModalOk = async () => {
    const fundingCycleData: V2FundingCycleData = {
      duration: deprecatedFundingCycle.duration,
      ballot: deprecatedFundingCycle.ballot,
      weight: deprecatedFundingCycle.weight,
      discountRate: deprecatedFundingCycle.discountRate,
    }

    const fundingCycleMetadata: V2FundingCycleMetadata =
      deprecatedFundingCycleMetadata

    await launchFundingCycleTx(
      {
        projectId,
        fundingCycleData,
        fundingCycleMetadata,
        fundAccessConstraints: [deprecatedFundAccessConstraint],
        groupedSplits: [
          {
            group: ETH_PAYOUT_SPLIT_GROUP,
            splits: deprecatedPayoutSplits ?? [],
          },
          {
            group: RESERVED_TOKEN_SPLIT_GROUP,
            splits: deprecatedTokenSplits ?? [],
          },
        ],
      },
      {
        onDone() {
          console.info('Transaction executed. Awaiting confirmation...')
          setTransactionPending(true)
        },
        onConfirmed() {
          setTransactionPending(false)
          window.location.reload()
        },
      },
    )
  }

  return (
    <>
      <Banner
        title={<Trans>Funding cycle required.</Trans>}
        body={
          <Trans>
            Your Juicebox project has no active funding cycle. Launch a funding
            cycle to re-enable payments on your project.
          </Trans>
        }
        actions={
          <>
            <Button type="primary" onClick={() => setModalOpen(true)}>
              <Trans>Review and launch funding cycle</Trans>
            </Button>
          </>
        }
      />
      <TransactionModal
        visible={modalOpen}
        title={<Trans>Launch funding cycle</Trans>}
        okText={
          <span>
            <Trans>Launch funding cycle</Trans>
          </span>
        }
        width={700}
        onOk={onLaunchModalOk}
        onCancel={() => setModalOpen(false)}
        transactionPending={transactionPending}
      >
        {loading ? (
          'Loading...'
        ) : (
          <>
            <p style={{ marginBottom: '2rem' }}>
              Relaunch your funding cycle on the new Juicebox V2 contracts.
            </p>
            <ReconfigurePreview
              payoutSplits={deprecatedPayoutSplits ?? []}
              reserveSplits={deprecatedTokenSplits ?? []}
              fundingCycleMetadata={deprecatedFundingCycleMetadata}
              fundingCycleData={deprecatedFundingCycle}
              fundAccessConstraints={[deprecatedFundAccessConstraint]}
            />
          </>
        )}
      </TransactionModal>
    </>
  )
}
