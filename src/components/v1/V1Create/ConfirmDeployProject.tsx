import { t, Trans } from '@lingui/macro'
import { Col, Row, Space, Statistic } from 'antd'
import { Gutter } from 'antd/lib/grid/row'

import CurrencySymbol from 'components/shared/CurrencySymbol'
import PayoutModsList from 'components/shared/PayoutModsList'
import ProjectLogo from 'components/shared/ProjectLogo'
import TicketModsList from 'components/shared/TicketModsList'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import {
  useAppSelector,
  useEditingV1FundingCycleSelector,
} from 'hooks/AppSelector'
import useMobile from 'hooks/Mobile'

import { useTerminalFee } from 'hooks/v1/TerminalFee'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useContext } from 'react'
import {
  formattedNum,
  formatWad,
  fromPerbicent,
  fromPermille,
} from 'utils/formatNumber'
import {
  hasFundingDuration,
  hasFundingTarget,
  isRecurring,
} from 'utils/fundingCycle'
import { amountSubFee } from 'utils/math'
import { orEmpty } from 'utils/orEmpty'

import { getBallotStrategyByAddress } from 'constants/ballotStrategies/getBallotStrategiesByAddress'

export default function ConfirmDeployProject() {
  const editingFC = useEditingV1FundingCycleSelector()
  const editingProject = useAppSelector(state => state.editingProject.info)
  const { terminal } = useContext(V1ProjectContext)
  const { payoutMods, ticketMods } = useAppSelector(
    state => state.editingProject,
  )
  const terminalFee = useTerminalFee(terminal?.version)

  const isMobile = useMobile()

  const rowGutter: [Gutter, Gutter] = [25, 20]

  return (
    <Space size="large" direction="vertical">
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
                uri={editingProject?.metadata.logoUri}
                name={editingProject?.metadata.name}
                size={isMobile ? 50 : 80}
              />
            </div>
          </Col>
          <Col md={6} xs={24}>
            <Statistic
              title={t`Name`}
              value={orEmpty(editingProject?.metadata.name)}
            />
          </Col>
          <Col md={6} xs={24}>
            <Statistic
              title={t`Handle`}
              value={t`@` + orEmpty(editingProject?.handle)}
            />
          </Col>
          <Col md={7} xs={24}>
            <Statistic
              title={t`Pay button`}
              value={
                editingProject?.metadata.payButton
                  ? editingProject?.metadata.payButton
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
                editingProject?.metadata.twitter
                  ? '@' + editingProject.metadata.twitter
                  : orEmpty(undefined)
              }
            />
          </Col>
          <Col md={9} xs={24}>
            <Statistic
              title={t`Discord`}
              value={orEmpty(editingProject?.metadata.discord)}
            />
          </Col>
          <Col md={9} xs={24}>
            <Statistic
              title={t`Website`}
              value={orEmpty(editingProject?.metadata.infoUri)}
            />
          </Col>
        </Row>
        <br />
        <Row gutter={rowGutter}>
          <Col md={24} xs={24}>
            <Statistic
              title={t`Pay disclosure`}
              value={orEmpty(editingProject?.metadata.payDisclosure)}
            />
          </Col>
        </Row>
      </div>
      <div style={{ marginTop: 20 }}>
        <h2 style={{ marginBottom: 0 }}>
          <Trans>Funding cycle details</Trans>
        </h2>
        <p style={{ marginBottom: 15 }}>
          {hasFundingDuration(editingFC) ? (
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
              hasFundingTarget(editingFC) ? (
                editingFC.target.eq(0) ? (
                  <span>
                    <Trans>
                      Target is 0: All funds will be considered overflow and can
                      be redeemed by burning project tokens.
                    </Trans>
                  </span>
                ) : (
                  <span>
                    <CurrencySymbol
                      currency={
                        editingFC?.currency.toNumber() as V1CurrencyOption
                      }
                    />
                    {formatWad(editingFC?.target)}{' '}
                    {editingFC.fee?.gt(0) && (
                      <span style={{ fontSize: '0.8rem' }}>
                        (
                        <CurrencySymbol
                          currency={
                            editingFC?.currency.toNumber() as V1CurrencyOption
                          }
                        />
                        <Trans>
                          {formatWad(
                            amountSubFee(editingFC.target, terminalFee),
                            {
                              precision: 4,
                            },
                          )}{' '}
                          after JBX fee
                        </Trans>
                        )
                      </span>
                    )}
                  </span>
                )
              ) : (
                <span>
                  <Trans>
                    No funding target: The project will control how all funds
                    are distributed, and none can be redeemed by token holders.
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
                  editingFC.duration.gt(0)
                    ? formattedNum(editingFC.duration)
                    : t`Not set`
                }
                suffix={editingFC.duration.gt(0) ? t`days` : ''}
              />
            </Col>
            <Col md={8} xs={24}>
              <Statistic
                title={t`Payments paused`}
                value={editingFC.payIsPaused ? t`Yes` : t`No`}
              />
            </Col>
            <Col md={8} xs={24}>
              <Statistic
                title={t`Token minting`}
                value={
                  editingFC.ticketPrintingIsAllowed ? t`Allowed` : t`Disabled`
                }
              />
            </Col>
          </Row>
          <Row gutter={rowGutter} style={{ width: '100%' }}>
            <Col md={8} xs={24}>
              <Statistic
                title={t`Reserved tokens`}
                value={fromPerbicent(editingFC?.reserved)}
                suffix="%"
              />
            </Col>
            {editingFC && isRecurring(editingFC) && (
              <Col md={8} xs={24}>
                <Statistic
                  title={t`Discount rate`}
                  value={fromPermille(editingFC?.discountRate)}
                  suffix="%"
                />
              </Col>
            )}
            {editingFC &&
              isRecurring(editingFC) &&
              hasFundingTarget(editingFC) && (
                <Col md={8} xs={24}>
                  <Statistic
                    title={t`Bonding curve rate`}
                    value={fromPerbicent(editingFC?.bondingCurveRate)}
                    suffix="%"
                  />
                </Col>
              )}
          </Row>
          {editingFC.duration.gt(0) && (
            <Statistic
              title={t`Reconfiguration strategy`}
              valueRender={() => {
                const ballot = getBallotStrategyByAddress(editingFC.ballot)
                return (
                  <div>
                    {ballot.name}{' '}
                    <div style={{ fontSize: '0.7rem' }}>{ballot.address}</div>
                  </div>
                )
              }}
            />
          )}
          <Statistic
            title={t`Spending`}
            valueRender={() => (
              <PayoutModsList
                mods={payoutMods}
                projectId={undefined}
                fundingCycle={editingFC}
                fee={terminalFee}
              />
            )}
          />
          <Statistic
            title={t`Reserved token allocations`}
            valueRender={() => (
              <TicketModsList
                mods={ticketMods}
                projectId={undefined}
                fundingCycle={undefined}
                reservedRate={parseFloat(fromPerbicent(editingFC?.reserved))}
              />
            )}
          />
        </Space>
      </div>
    </Space>
  )
}
