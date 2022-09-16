import { Trans } from '@lingui/macro'
import { Button, Form, Input } from 'antd'
import { useContext, useEffect, useMemo, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import Banner from 'components/Banner'
import TransactionModal from 'components/TransactionModal'
import { V2UserContext } from 'contexts/v2/userContext'
import useProjectCurrentFundingCycle from 'hooks/v2/contractReader/ProjectCurrentFundingCycle'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import useProjectSplits from 'hooks/v2/contractReader/ProjectSplits'
import useProjectTerminals from 'hooks/v2/contractReader/ProjectTerminals'
import { useLaunchFundingCyclesTx } from 'hooks/v2/transactor/LaunchFundingCyclesTx'
import {
  V2FundAccessConstraint,
  V2FundingCycleData,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'

import { reloadWindow } from 'utils/windowUtils'

import { readNetwork } from 'constants/networks'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import {
  BALLOT_ADDRESSES,
  DEPRECATED_BALLOT_ADDRESSES,
} from 'constants/v2/ballotStrategies'
import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import ReconfigurePreview from '../V2ProjectSettings/pages/V2ProjectReconfigureFundingCycleSettingsPage/ReconfigurePreview'

export function RelaunchFundingCycleBanner() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { contracts } = useContext(V2UserContext)
  const [newDuration, setNewDuration] = useState<BigNumber>(BigNumber.from(0))
  const [newStart, setNewStart] = useState<string>('1')

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [transactionPending, setTransactionPending] = useState<boolean>(false)

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

  useEffect(() => {
    setNewDuration(deprecatedFundingCycle?.duration ?? BigNumber.from(0))
  }, [deprecatedFundingCycle])

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
    overflowAllowance: BigNumber.from(0),
    overflowAllowanceCurrency: BigNumber.from(0),
  }

  const launchFundingCycleTx = useLaunchFundingCyclesTx()

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
      duration: newDuration ?? deprecatedFundingCycle.duration,
      ballot: newBallot ?? deprecatedFundingCycle.ballot,
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
              <Trans>
                Relaunch your funding cycle on the new Juicebox V2 contracts.
              </Trans>
            </p>
            <Form layout="vertical" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: 20 }}>
                <Form.Item
                  label={<Trans>Duration (seconds)</Trans>}
                  required
                  style={{ width: '100%' }}
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
                  label={<Trans>Start time (seconds, Unix time)</Trans>}
                  style={{ width: '100%' }}
                  extra={<Trans>Leave blank to start immediately.</Trans>}
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
              <Trans>Funding cycle preview</Trans>
            </h3>
            <p>
              <Trans>
                Your funding cycle configuration has been pre-populated using
                the configuration you originally launched with. If you need to
                customize it, contact us.
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
            />
          </>
        )}
      </TransactionModal>
    </>
  )
}
