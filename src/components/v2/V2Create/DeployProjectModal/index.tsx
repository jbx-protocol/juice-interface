import { t, Trans } from '@lingui/macro'
import { Col, Modal, Row, Space, Statistic } from 'antd'
import { Gutter } from 'antd/lib/grid/row'
import ProjectLogo from 'components/shared/ProjectLogo'
import TicketModsList from 'components/shared/TicketModsList'
import { useAppSelector } from 'hooks/AppSelector'
import useMobile from 'hooks/Mobile'
import { useETHPaymentTerminalFee } from 'hooks/v2/contractReader/ETHPaymentTerminalFee'
import { orEmpty } from 'utils/orEmpty'
import { useContext } from 'react'
import { NetworkContext } from 'contexts/networkContext'
import {
  getDefaultFundAccessConstraint,
  hasFundingDuration,
  hasFundingTarget,
} from 'utils/v2/fundingCycle'
import { SerializedV2FundAccessConstraint } from 'utils/v2/serializers'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { formattedNum, formatWad, parseWad } from 'utils/formatNumber'
import { amountSubFee } from 'utils/math'
import { toV1Currency } from 'utils/v1/currency'

import PayoutSplitsList from './PayoutSplitsList'

import { getBallotStrategyByAddress } from 'constants/ballotStrategies/getBallotStrategiesByAddress'

export default function ConfirmDeployV2ProjectModal({
  onOk,
  onCancel,
  visible,
  confirmLoading,
}: {
  onOk?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onCancel?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  visible?: boolean
  confirmLoading?: boolean
}) {
  const { signerNetwork, userAddress } = useContext(NetworkContext)
  const {
    fundAccessConstraints,
    fundingCycleData,
    fundingCycleMetadata,
    payoutGroupedSplits,
    projectMetadata,
    reserveTokenGroupedSplits,
  } = useAppSelector(state => state.editingV2Project)

  const fundAccessConstraint =
    getDefaultFundAccessConstraint<SerializedV2FundAccessConstraint>(
      fundAccessConstraints,
    )

  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()

  const isMobile = useMobile()

  const rowGutter: [Gutter, Gutter] = [25, 20]

  const fundingCurrency = toV1Currency(
    parseInt(
      fundAccessConstraint?.distributionLimitCurrency ?? '1',
    ) as V2CurrencyOption,
  )
  return (
    <Modal
      visible={visible}
      onOk={onOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      okText={
        userAddress
          ? signerNetwork
            ? t`Deploy project on ${signerNetwork}`
            : t`Deploy project`
          : t`Connect wallet to deploy`
      }
      width={800}
    >
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <h1 style={{ fontSize: '2rem' }}>
          <Trans>Review project</Trans>
        </h1>
        <div>
          <h2 style={{ marginBottom: 0 }}>
            <Trans>Project details</Trans>
          </h2>
          <p>
            <Trans>These attributes can be changed at any time.</Trans>
          </p>
          <Row gutter={rowGutter} style={{ marginBottom: 20 }}>
            <Col md={5} xs={24}>
              <Statistic title={t`Logo`} value={' '} />
              <div style={{ marginTop: -20 }}>
                <ProjectLogo
                  uri={projectMetadata?.logoUri}
                  name={projectMetadata?.name}
                  size={isMobile ? 50 : 80}
                />
              </div>
            </Col>
            <Col md={6} xs={24}>
              <Statistic
                title={t`Name`}
                value={orEmpty(projectMetadata?.name)}
              />
            </Col>
            <Col md={7} xs={24}>
              <Statistic
                title={t`Pay button`}
                value={
                  projectMetadata?.payButton
                    ? projectMetadata?.payButton
                    : t`Pay`
                }
              />
            </Col>
          </Row>
          <Row gutter={rowGutter} style={{ wordBreak: 'break-all' }}>
            <Col md={5} xs={24}>
              <Statistic
                title={t`Twitter`}
                value={
                  projectMetadata?.twitter
                    ? '@' + projectMetadata?.twitter
                    : orEmpty(undefined)
                }
              />
            </Col>
            <Col md={9} xs={24}>
              <Statistic
                title={t`Discord`}
                value={orEmpty(projectMetadata?.discord)}
              />
            </Col>
            <Col md={9} xs={24}>
              <Statistic
                title={t`Website`}
                value={orEmpty(projectMetadata?.infoUri)}
              />
            </Col>
          </Row>
          <br />
          <Row gutter={rowGutter}>
            <Col md={24} xs={24}>
              <Statistic
                title={t`Pay disclosure`}
                value={orEmpty(projectMetadata?.payDisclosure)}
              />
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: 20 }}>
          <h2 style={{ marginBottom: 0 }}>
            <Trans>Funding cycle details</Trans>
          </h2>
          <p style={{ marginBottom: 15 }}>
            {hasFundingDuration(fundingCycleData) ? (
              <Trans>
                These settings will <strong>not</strong> be editable immediately
                within a funding cycle. They can only be changed for{' '}
                <strong>upcoming</strong> funding cycles.
              </Trans>
            ) : (
              <Trans>
                Since you have not set a funding duration, changes to these
                settings will be applied immediately.
              </Trans>
            )}
          </p>
          <Space size="large" direction="vertical" style={{ width: '100%' }}>
            <Statistic
              title={t`Target`}
              valueRender={() =>
                fundAccessConstraint?.distributionLimit !== undefined ? (
                  !hasFundingTarget(fundAccessConstraint) ? (
                    <span>
                      <Trans>
                        Target is 0: All funds will be considered overflow and
                        can be redeemed by burning project tokens.
                      </Trans>
                    </span>
                  ) : (
                    <span>
                      <CurrencySymbol currency={fundingCurrency} />
                      {formattedNum(
                        fundAccessConstraint.distributionLimit,
                      )}{' '}
                      <span style={{ fontSize: '0.8rem' }}>
                        (
                        <CurrencySymbol currency={fundingCurrency} />
                        <Trans>
                          {formatWad(
                            amountSubFee(
                              parseWad(fundAccessConstraint.distributionLimit),
                              ETHPaymentTerminalFee,
                            ),
                            {
                              precision: 4,
                            },
                          )}{' '}
                          after JBX fee
                        </Trans>
                        )
                      </span>
                    </span>
                  )
                ) : (
                  <span>
                    <Trans>
                      No funding target: The project will control how all funds
                      are distributed, and none can be redeemed by token
                      holders.
                    </Trans>
                  </span>
                )
              }
            />
            <Row gutter={rowGutter} style={{ width: '100%' }}>
              <Col md={8} xs={24}>
                <Statistic
                  title={t`Duration`}
                  value={
                    hasFundingDuration(fundingCycleData)
                      ? formattedNum(fundingCycleData.duration)
                      : t`Not set`
                  }
                  suffix={
                    hasFundingDuration(fundingCycleData) ? t`seconds` : ''
                  }
                />
              </Col>
              <Col md={8} xs={24}>
                <Statistic
                  title={t`Payments paused`}
                  value={fundingCycleMetadata.pausePay ? t`Yes` : t`No`}
                />
              </Col>
              <Col md={8} xs={24}>
                <Statistic
                  title={t`Token minting`}
                  value={
                    fundingCycleMetadata.pauseMint ? t`Allowed` : t`Disabled`
                  }
                />
              </Col>
            </Row>
            <Row gutter={rowGutter} style={{ width: '100%' }}>
              <Col md={8} xs={24}>
                <Statistic
                  title={t`Reserved tokens`}
                  value={fundingCycleMetadata.reservedRate}
                  suffix="%"
                />
              </Col>
              {fundingCycleData && hasFundingDuration(fundingCycleData) && (
                <Col md={8} xs={24}>
                  <Statistic
                    title={t`Discount rate`}
                    value={fundingCycleData?.discountRate}
                    suffix="%"
                  />
                </Col>
              )}
              {fundingCycleMetadata && (
                <Col md={8} xs={24}>
                  <Statistic
                    title={t`Redemption rate`}
                    value={fundingCycleMetadata?.redemptionRate}
                    suffix="%"
                  />
                </Col>
              )}
            </Row>
            {hasFundingDuration(fundingCycleData) && fundingCycleData.ballot && (
              <Statistic
                title={t`Reconfiguration rules`}
                valueRender={() => {
                  const ballot = getBallotStrategyByAddress(
                    fundingCycleData.ballot,
                  )
                  return (
                    <div>
                      {ballot.name}{' '}
                      <div style={{ fontSize: '0.7rem' }}>{ballot.address}</div>
                    </div>
                  )
                }}
              />
            )}
            {payoutGroupedSplits.splits.length ? (
              <Statistic
                title={t`Spending`}
                valueRender={() => (
                  <PayoutSplitsList
                    splits={payoutGroupedSplits.splits}
                    fundAccessConstraint={fundAccessConstraint}
                  />
                )}
              />
            ) : null}
            {fundingCycleMetadata.reservedRate &&
            fundingCycleMetadata.reservedRate !== '0' ? (
              <Statistic
                title={t`Reserved token allocations`}
                valueRender={() => (
                  <TicketModsList
                    mods={reserveTokenGroupedSplits.splits}
                    reservedRate={parseFloat(fundingCycleMetadata.reservedRate)}
                    projectId={undefined}
                    fundingCycle={undefined}
                  />
                )}
              />
            ) : null}
          </Space>
        </div>
      </Space>
    </Modal>
  )
}
