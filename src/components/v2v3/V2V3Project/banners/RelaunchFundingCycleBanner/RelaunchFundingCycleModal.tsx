import { Trans } from '@lingui/macro'
import { Form, Input, ModalProps } from 'antd'
import TransactionModal from 'components/TransactionModal'
import { readNetwork } from 'constants/networks'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import {
  BALLOT_ADDRESSES,
  DEPRECATED_BALLOT_ADDRESSES,
} from 'constants/v2v3/ballotStrategies'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import { useDefaultJBETHPaymentTerminal } from 'hooks/defaultContracts/useDefaultJBETHPaymentTerminal'
import useProjectCurrentFundingCycle from 'hooks/v2v3/contractReader/useProjectCurrentFundingCycle'
import useProjectDistributionLimit from 'hooks/v2v3/contractReader/useProjectDistributionLimit'
import useProjectSplits from 'hooks/v2v3/contractReader/useProjectSplits'
import useProjectTerminals from 'hooks/v2v3/contractReader/useProjectTerminals'
import { useLaunchFundingCyclesTx } from 'hooks/v2v3/transactor/useLaunchFundingCyclesTx'
import {
  V2V3FundAccessConstraint,
  V2V3FundingCycleData,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import Link from 'next/link'
import { useContext, useEffect, useMemo, useState } from 'react'
import { reloadWindow } from 'utils/windowUtils'
import { ReconfigurePreview } from '../../V2V3ProjectSettings/pages/ReconfigureFundingCycleSettingsPage/ReconfigurePreview'

export function RelaunchFundingCycleModal(props: ModalProps) {
  const { projectId } = useContext(ProjectMetadataContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)

  const [newDuration, setNewDuration] = useState<BigNumber>(BigNumber.from(0))
  const [newStart, setNewStart] = useState<string>('1')
  const [transactionPending, setTransactionPending] = useState<boolean>(false)

  const defaultJBETHPaymentTerminal = useDefaultJBETHPaymentTerminal()
  const { data, loading: deprecatedFundingCycleLoading } =
    useProjectCurrentFundingCycle({
      projectId,
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
    })

  const [deprecatedDistributionLimit, deprecatedDistributionLimitCurrency] =
    distributionLimitData ?? []

  const deprecatedFundAccessConstraint: V2V3FundAccessConstraint = {
    terminal: defaultJBETHPaymentTerminal?.address ?? '',
    token: ETH_TOKEN_ADDRESS,
    distributionLimit: deprecatedDistributionLimit,
    distributionLimitCurrency: deprecatedDistributionLimitCurrency,
    overflowAllowance: BigNumber.from(0),
    overflowAllowanceCurrency: BigNumber.from(0),
  }

  const newBallot = useMemo(() => {
    if (!deprecatedFundingCycle) return

    switch (deprecatedFundingCycle.ballot) {
      case DEPRECATED_BALLOT_ADDRESSES.THREE_DAY[readNetwork.name]:
        return BALLOT_ADDRESSES.THREE_DAY[readNetwork.name]!
      // case DEPRECATED_BALLOT_ADDRESSES.SEVEN_DAY[readNetwork.name]:
      //   return BALLOT_ADDRESSES.SEVEN_DAY[readNetwork.name]!
      default:
        return deprecatedFundingCycle.ballot
    }
  }, [deprecatedFundingCycle])

  useEffect(() => {
    setNewDuration(deprecatedFundingCycle?.duration ?? BigNumber.from(0))
  }, [deprecatedFundingCycle])

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
    const fundingCycleData: V2V3FundingCycleData = {
      duration: newDuration ?? deprecatedFundingCycle.duration,
      ballot: newBallot ?? deprecatedFundingCycle.ballot,
      weight: deprecatedFundingCycle.weight,
      discountRate: deprecatedFundingCycle.discountRate,
    }

    const fundingCycleMetadata: V2V3FundingCycleMetadata =
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
        mustStartAtOrAfter: newStart,
      },
      {
        onDone() {
          console.info('Transaction executed. Awaiting confirmation...')
          setTransactionPending(true)
        },
        onConfirmed() {
          setTransactionPending(false)
          reloadWindow()
        },
      },
    )
  }

  return (
    <TransactionModal
      title={<Trans>Launch cycle</Trans>}
      okText={
        <span>
          <Trans>Launch cycle</Trans>
        </span>
      }
      width={700}
      onOk={onLaunchModalOk}
      transactionPending={transactionPending}
      {...props}
    >
      {loading ? (
        'Loading...'
      ) : (
        <>
          <p className="mb-8">
            <Trans>Relaunch your cycle on the new Juicebox V2 contracts.</Trans>
          </p>
          <Form className="mb-4" layout="vertical">
            <div className="flex gap-5">
              <Form.Item
                label={<Trans>Duration (seconds)</Trans>}
                required
                className="w-full"
                extra={
                  newDuration.toNumber() > 0
                    ? `= ${newDuration.toNumber() / 86400} days`
                    : ''
                }
              >
                <Input
                  type="number"
                  min={0}
                  value={newDuration.toNumber()}
                  onChange={e => {
                    setNewDuration(BigNumber.from(e.target.value || 0))
                  }}
                />
              </Form.Item>

              <Form.Item
                label={<Trans>Start time</Trans>}
                required={false}
                requiredMark="optional"
                extra={
                  <Trans>
                    Unix timestamp in seconds. Leave blank to start immediately.
                  </Trans>
                }
                className="w-full"
              >
                <Input
                  type="number"
                  min={0}
                  onChange={e => {
                    setNewStart(e.target.value || '1')
                  }}
                />
              </Form.Item>
            </div>
          </Form>

          <h3>
            <Trans>Cycle preview</Trans>
          </h3>
          <p>
            <Trans>
              Your cycle rules have been pre-populated using the rules you
              originally launched with. If you need to customize them,{' '}
              <Link href="/contact">contact us</Link>.
            </Trans>
          </p>

          <ReconfigurePreview
            payoutSplits={deprecatedPayoutSplits ?? []}
            reserveSplits={deprecatedTokenSplits ?? []}
            fundingCycleMetadata={deprecatedFundingCycleMetadata}
            fundingCycleData={{
              ...deprecatedFundingCycle,
              duration: newDuration ?? deprecatedFundingCycle.duration,
              ballot: newBallot ?? deprecatedFundingCycle.ballot,
            }}
            fundAccessConstraints={[deprecatedFundAccessConstraint]}
            projectOwnerAddress={projectOwnerAddress}
          />
        </>
      )}
    </TransactionModal>
  )
}
