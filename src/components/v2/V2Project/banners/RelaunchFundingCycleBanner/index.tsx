import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useContext, useState } from 'react'

import Banner from 'components/shared/Banner'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useDeprecatedProjectCurrentFundingCycle from 'hooks/v2/contractReader/DeprecatedProjectCurrentFundingCycle'
import { useLaunchFundingCyclesTx } from 'hooks/v2/transactor/LaunchFundingCyclesTx'
import TransactionModal from 'components/shared/TransactionModal'
import {
  V2FundAccessConstraint,
  V2FundingCycleData,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'
import useDeprecatedProjectSplits from 'hooks/v2/contractReader/DeprecatedProjectSplits'
import { V2UserContext } from 'contexts/v2/userContext'
import { BigNumber } from '@ethersproject/bignumber'
import useDeprecatedProjectTerminals from 'hooks/v2/contractReader/DeprecatedProjectTerminals'
import useDeprecatedProjectDistributionLimit from 'hooks/v2/contractReader/DeprecatedProjectDistributionLimit'

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
    useDeprecatedProjectCurrentFundingCycle({
      projectId,
    })
  const [deprecatedFundingCycle, deprecatedFundingCycleMetadata] = data ?? []

  const { data: deprecatedPayoutSplits, loading: payoutSplitsLoading } =
    useDeprecatedProjectSplits({
      projectId,
      splitGroup: ETH_PAYOUT_SPLIT_GROUP,
      domain: deprecatedFundingCycle?.configuration?.toString(),
    })
  const { data: deprecatedTokenSplits, loading: tokenSplitsLoading } =
    useDeprecatedProjectSplits({
      projectId,
      splitGroup: RESERVED_TOKEN_SPLIT_GROUP,
      domain: deprecatedFundingCycle?.configuration?.toString(),
    })

  const { data: terminals } = useDeprecatedProjectTerminals({
    projectId,
  })
  const primaryTerminal = terminals?.[0]

  const { data: distributionLimitData, loading: distributionLimitLoading } =
    useDeprecatedProjectDistributionLimit({
      projectId,
      configuration: deprecatedFundingCycle?.configuration?.toString(),
      terminal: primaryTerminal,
    })

  const [deprecatedDistributionLimit, deprecatedDistributionLimitCurrency] =
    distributionLimitData ?? []

  const fundAccessConstraint: V2FundAccessConstraint = {
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
        fundAccessConstraints: [fundAccessConstraint],
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
            Your Juicebox project has no current funding cycle. Launch a funding
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
          'loading...'
        ) : (
          <ReconfigurePreview
            payoutSplits={[]}
            reserveSplits={[]}
            fundingCycleMetadata={deprecatedFundingCycleMetadata}
            fundingCycleData={deprecatedFundingCycle}
            fundAccessConstraints={[]}
          />
        )}
      </TransactionModal>
    </>
  )
}
