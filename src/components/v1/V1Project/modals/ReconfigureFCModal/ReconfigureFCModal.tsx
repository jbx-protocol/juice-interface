import { CaretRightFilled } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Drawer, DrawerProps, Modal, Space, Statistic } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import BudgetForm from 'components/v1/shared/forms/BudgetForm'
import PayModsForm from 'components/v1/shared/forms/PayModsForm'
import PayoutModsList from 'components/v1/shared/PayoutModsList'
import ReconfigurationStrategyDrawer from 'components/v1/shared/ReconfigurationStrategyDrawer'
import TicketModsList from 'components/v1/shared/TicketModsList'
import IncentivesForm, {
  IncentivesFormFields,
} from 'components/v1/V1Project/modals/ReconfigureFCModal/IncentivesForm'
import RestrictedActionsForm, {
  RestrictedActionsFormFields,
} from 'components/v1/V1Project/modals/ReconfigureFCModal/RestrictedActionsForm'
import TicketingForm, {
  TicketingFormFields,
} from 'components/v1/V1Project/modals/ReconfigureFCModal/TicketingForm'
import { SECONDS_IN_DAY } from 'constants/numbers'
import { getBallotStrategyByAddress } from 'constants/v1/ballotStrategies/getBallotStrategiesByAddress'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { constants } from 'ethers'

import { BigNumber } from 'ethers'
import { useConfigureProjectTx } from 'hooks/v1/transactor/useConfigureProjectTx'
import { useTerminalFee } from 'hooks/v1/useTerminalFee'
import { BallotStrategy } from 'models/ballot'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { V1FundingCycle, V1FundingCycleMetadata } from 'models/v1/fundingCycle'
import { PayoutMod, TicketMod } from 'models/v1/mods'
import { useCallback, useContext, useLayoutEffect, useState } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useEditingV1FundingCycleSelector } from 'redux/hooks/useAppSelector'
import { editingProjectActions } from 'redux/slices/editingProject'
import { classNames } from 'utils/classNames'
import { drawerWidth } from 'utils/drawerWidth'
import {
  formattedNum,
  formatWad,
  fromWad,
  perbicentToPercent,
  permilleToPercent,
} from 'utils/format/formatNumber'
import { detailedTimeString, secondsUntil } from 'utils/format/formatTime'
import { V1CurrencyName } from 'utils/v1/currency'
import {
  decodeFundingCycleMetadata,
  hasFundingTarget,
  isRecurring,
} from 'utils/v1/fundingCycle'
import { amountSubFee } from 'utils/v1/math'
import { serializeV1FundingCycle } from 'utils/v1/serializers'

const V1ReconfigureUpcomingMessage = ({
  currentFC,
}: {
  currentFC: V1FundingCycle | undefined
}) => {
  if (!currentFC) return null
  const currentFCNumber = currentFC.number.toNumber()
  const ballotStrategy = getBallotStrategyByAddress(currentFC.ballot)
  const ballotStrategyLength = ballotStrategy.durationSeconds
  const duration = currentFC.duration.toNumber()
  const durationInSeconds = duration * SECONDS_IN_DAY
  const secondsUntilNextFC = secondsUntil(
    currentFC.start.add(durationInSeconds),
  )
  if (!duration || duration === 0) {
    // If duration is unset/0, changes take effect immediately to current FC
    return (
      <Trans>
        Your project's current cycle has no duration. Edits you make below will
        take effect immediately.
      </Trans>
    )
  } else if (ballotStrategyLength === undefined) {
    return (
      <Trans>
        The edits you make below may take effect, depending on the project's
        custom edit deadline contract.
      </Trans>
    )
  } else if (ballotStrategyLength > secondsUntilNextFC) {
    return (
      <Trans>
        Due to your <strong>{ballotStrategy.name}</strong> contract, edits you
        make will not take effect until the first cycle to start at least{' '}
        <strong>
          {detailedTimeString({
            timeSeconds: BigNumber.from(ballotStrategyLength),
            fullWords: true,
          })}
        </strong>{' '}
        from now.
      </Trans>
    )
  } else {
    return (
      <>
        <div>
          <Trans>
            Your edits will take effect in{' '}
            <strong>cycle #{currentFCNumber + 1}</strong>. The current cycle (#
            {currentFCNumber}) won't be altered.
          </Trans>
        </div>
        <br />
        <div>
          <Trans>Time remaining for edits to affect the next cycle:</Trans>
        </div>
        <div>
          <strong>
            {detailedTimeString({
              timeSeconds: BigNumber.from(
                secondsUntilNextFC - ballotStrategyLength,
              ),
              fullWords: true,
            })}
          </strong>
          .
        </div>
      </>
    )
  }
}

export default function ReconfigureFCModal({
  open,
  onDone,
}: {
  open?: boolean
  onDone?: VoidFunction
}) {
  const {
    queuedFC,
    currentFC,
    terminal,
    queuedPayoutMods,
    currentPayoutMods,
    queuedTicketMods,
    currentTicketMods,
  } = useContext(V1ProjectContext)

  const [currentStep, setCurrentStep] = useState<number>()
  const [payModsModalVisible, setPayModsFormModalVisible] =
    useState<boolean>(false)
  const [budgetFormModalVisible, setBudgetFormModalVisible] =
    useState<boolean>(false)
  const [rulesFormModalVisible, setRulesFormModalVisible] =
    useState<boolean>(false)
  const [incentivesFormModalVisible, setIncentivesFormModalVisible] =
    useState<boolean>(false)
  const [ticketingFormModalVisible, setTicketingFormModalVisible] =
    useState<boolean>(false)
  const [
    restrictedActionsFormModalVisible,
    setRestrictedActionsFormModalVisible,
  ] = useState<boolean>(false)
  useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>()
  const [ticketingForm] = useForm<TicketingFormFields>()
  const [incentivesForm] = useForm<IncentivesFormFields>()
  const [restrictedActionsForm] = useForm<RestrictedActionsFormFields>()
  const [editingPayoutMods, setEditingPayoutMods] = useState<PayoutMod[]>([])
  const [editingTicketMods, setEditingTicketMods] = useState<TicketMod[]>([])

  const dispatch = useAppDispatch()

  const editingFC = useEditingV1FundingCycleSelector()
  const terminalFee = useTerminalFee(terminal?.version)
  const configureProjectTx = useConfigureProjectTx()

  const resetTicketingForm = () =>
    ticketingForm.setFieldsValue({
      reserved: parseFloat(perbicentToPercent(editingFC?.reserved)),
    })

  const fcMetadata: V1FundingCycleMetadata | undefined =
    decodeFundingCycleMetadata(currentFC?.metadata)

  const editingFCCurrency = V1CurrencyName(
    editingFC.currency.toNumber() as V1CurrencyOption,
  )

  const resetRestrictedActionsForm = () => {
    if (fcMetadata?.version === 1) {
      restrictedActionsForm.setFieldsValue({
        payIsPaused: fcMetadata?.payIsPaused,
        ticketPrintingIsAllowed: fcMetadata?.ticketPrintingIsAllowed,
      })
    }
  }

  const onPayModsFormSaved = (mods: PayoutMod[]) => setEditingPayoutMods(mods)

  const onBudgetFormSaved = (
    currency: V1CurrencyOption,
    target: string,
    duration: string,
  ) => {
    dispatch(editingProjectActions.setTarget(target))
    dispatch(editingProjectActions.setDuration(duration))
    dispatch(editingProjectActions.setCurrency(currency))
  }

  const onTicketingFormSaved = (mods: TicketMod[]) => {
    const fields = ticketingForm.getFieldsValue(true)
    dispatch(editingProjectActions.setReserved(fields.reserved))
    setEditingTicketMods(mods)
  }

  const onRestrictedActionsFormSaved = () => {
    const fields = restrictedActionsForm.getFieldsValue(true)
    dispatch(
      editingProjectActions.setTicketPrintingIsAllowed(
        fields.ticketPrintingIsAllowed,
      ),
    )
    dispatch(editingProjectActions.setPayIsPaused(fields.payIsPaused))
  }

  const onRulesFormSaved = (ballot: string) => {
    dispatch(editingProjectActions.setBallot(ballot))
  }

  const onIncentivesFormSaved = (
    discountRate: string,
    bondingCurveRate: string,
  ) => {
    dispatch(editingProjectActions.setDiscountRate(discountRate))
    dispatch(editingProjectActions.setBondingCurveRate(bondingCurveRate))
  }

  useLayoutEffect(() => {
    const fundingCycle = queuedFC?.number.gt(0) ? queuedFC : currentFC
    const payoutMods = queuedFC?.number.gt(0)
      ? queuedPayoutMods
      : currentPayoutMods
    const ticketMods = queuedFC?.number.gt(0)
      ? queuedTicketMods
      : currentTicketMods

    if (!open || !fundingCycle || !ticketMods || !payoutMods) return

    const metadata = decodeFundingCycleMetadata(fundingCycle.metadata)
    if (!metadata) return

    dispatch(
      editingProjectActions.setFundingCycle(
        serializeV1FundingCycle({
          ...fundingCycle,
          ...metadata,
          reserved: BigNumber.from(metadata.reservedRate),
          bondingCurveRate: BigNumber.from(metadata.bondingCurveRate),
        }),
      ),
    )
    setEditingTicketMods(ticketMods)
    setEditingPayoutMods(payoutMods)
    ticketingForm.setFieldsValue({
      reserved: parseFloat(perbicentToPercent(metadata.reservedRate)),
    })
    incentivesForm.setFieldsValue({
      discountRate: permilleToPercent(fundingCycle.discountRate),
      bondingCurveRate: perbicentToPercent(metadata.bondingCurveRate),
    })

    if (metadata.version === 1) {
      restrictedActionsForm.setFieldsValue({
        payIsPaused: metadata.payIsPaused,
        ticketPrintingIsAllowed: metadata.ticketPrintingIsAllowed,
      })
    }
  }, [
    currentFC,
    queuedFC,
    currentPayoutMods,
    queuedPayoutMods,
    currentTicketMods,
    queuedTicketMods,
    dispatch,
    ticketingForm,
    incentivesForm,
    restrictedActionsForm,
    open,
  ])

  async function reconfigure() {
    setLoading(true)

    configureProjectTx(
      {
        fcProperties: {
          target: editingFC.target,
          currency: editingFC.currency,
          duration: editingFC.duration,
          discountRate: editingFC.discountRate,
          cycleLimit: BigNumber.from(0),
          ballot: editingFC.ballot,
        },
        fcMetadata: {
          reservedRate: editingFC.reserved.toNumber(),
          bondingCurveRate: editingFC.bondingCurveRate.toNumber(),
          reconfigurationBondingCurveRate:
            editingFC.bondingCurveRate.toNumber(),
          payIsPaused: editingFC.payIsPaused,
          ticketPrintingIsAllowed: editingFC.ticketPrintingIsAllowed,
          treasuryExtension: constants.AddressZero,
        },
        payoutMods: editingPayoutMods,
        ticketMods: editingTicketMods,
      },
      {
        onDone: () => {
          setLoading(false)
          if (onDone) onDone()
        },
      },
    )
  }

  const drawerProps: Partial<DrawerProps> = {
    placement: 'right',
    width: drawerWidth(),
  }

  const buildSteps = useCallback(
    (steps: { title: string; callback: VoidFunction }[]) => (
      <Space direction="vertical" size="middle" className="w-full">
        {steps.map((step, i) => {
          const active = currentStep === i

          return (
            <div
              className={classNames(
                'flex cursor-pointer justify-between rounded-sm border p-2',
                active
                  ? 'border-bluebs-500 dark:border-bluebs-300'
                  : 'border-[#32c8db44] dark:border-[#e1e0e844]',
              )}
              key={step.title}
              onClick={() => {
                setCurrentStep(i)
                step.callback()
              }}
            >
              <div
                className={classNames(
                  active
                    ? 'font-medium text-bluebs-500 dark:text-bluebs-300'
                    : 'font-normal text-black dark:text-slate-100',
                )}
              >
                {step.title}
              </div>
              <div
                className={classNames(
                  active
                    ? 'text-bluebs-500 dark:text-bluebs-300'
                    : 'text-black dark:text-slate-100',
                )}
              >
                <CaretRightFilled />
              </div>
            </div>
          )
        })}
      </Space>
    ),
    [currentStep],
  )

  if (!terminal?.version) return null

  return (
    <Modal
      title={<Trans>Project rules</Trans>}
      open={open}
      onOk={reconfigure}
      confirmLoading={loading}
      onCancel={onDone}
      okText={t`Save edits`}
      width={600}
    >
      <div>
        <h4 className="mb-0">
          <Trans>Edit upcoming cycles</Trans>
        </h4>
        <Callout.Info>
          <V1ReconfigureUpcomingMessage currentFC={currentFC} />
        </Callout.Info>

        <Space direction="vertical" size="large" className="w-full">
          <div>
            {buildSteps([
              {
                title: t`Cycle`,
                callback: () => setBudgetFormModalVisible(true),
              },
              ...(editingFC.target.gt(0)
                ? [
                    {
                      title: t`Payouts`,
                      callback: () => setPayModsFormModalVisible(true),
                    },
                  ]
                : []),
              {
                title: t`Reserved tokens`,
                callback: () => setTicketingFormModalVisible(true),
              },
              {
                title: t`Other rules`,
                callback: () => setRulesFormModalVisible(true),
              },
              ...(terminal.version === '1.1'
                ? [
                    {
                      title: 'Actions',
                      callback: () =>
                        setRestrictedActionsFormModalVisible(true),
                    },
                  ]
                : []),
              ...(isRecurring(editingFC) && hasFundingTarget(editingFC)
                ? [
                    {
                      title: t`Token rules`,
                      callback: () => setIncentivesFormModalVisible(true),
                    },
                  ]
                : []),
            ])}
          </div>

          <Space size="large">
            <Statistic
              title={t`Duration`}
              value={
                editingFC.duration.gt(0)
                  ? formattedNum(editingFC.duration)
                  : 'Not set'
              }
              suffix={editingFC.duration.gt(0) ? 'days' : ''}
            />
            {hasFundingTarget(editingFC) && (
              <Statistic
                title={t`Amount`}
                valueRender={() => (
                  <span>
                    <CurrencySymbol currency={editingFCCurrency} />
                    {formatWad(editingFC.target)}{' '}
                    <span className="text-sm">
                      (
                      {terminalFee?.gt(0) ? (
                        <span>
                          <CurrencySymbol currency={editingFCCurrency} />
                          <Trans>
                            {formatWad(
                              amountSubFee(editingFC.target, terminalFee),
                              { precision: 4 },
                            )}{' '}
                            after JBX fee
                          </Trans>
                        </span>
                      ) : (
                        <span>
                          <Trans>0% fee</Trans>
                        </span>
                      )}
                      )
                    </span>
                  </span>
                )}
              />
            )}
          </Space>

          <Space size="large" align="end">
            <Statistic
              title={t`Reserved tokens`}
              value={perbicentToPercent(editingFC.reserved)}
              suffix="%"
            />
            {editingFC &&
              isRecurring(editingFC) &&
              hasFundingTarget(editingFC) && (
                <Statistic
                  title={t`Issuance reduction rate`}
                  value={permilleToPercent(editingFC.discountRate)}
                  suffix="%"
                />
              )}
            {editingFC &&
              isRecurring(editingFC) &&
              hasFundingTarget(editingFC) && (
                <Statistic
                  title={t`Redemption rate`}
                  value={perbicentToPercent(editingFC.bondingCurveRate)}
                  suffix="%"
                />
              )}
          </Space>

          <Statistic
            title={t`Edit deadline`}
            valueRender={() => {
              const ballot = getBallotStrategyByAddress(editingFC.ballot)
              return (
                <div>
                  {ballot.name} <div className="text-xs">{ballot.address}</div>
                </div>
              )
            }}
          />

          {terminal.version === '1.1' && (
            <Space size="large">
              <Statistic
                title={t`Payments to this project paused`}
                value={editingFC.payIsPaused ? 'Yes' : 'No'}
              />
              <Statistic
                title={t`Owner token minting`}
                value={
                  editingFC.ticketPrintingIsAllowed ? 'Allowed' : 'Disabled'
                }
              />
            </Space>
          )}

          <div>
            <h4>
              <Trans>Payouts</Trans>
            </h4>
            <PayoutModsList
              mods={editingPayoutMods}
              projectId={undefined}
              fundingCycle={editingFC}
              feePerbicent={terminalFee}
            />
          </div>

          <div>
            <h4>
              <Trans>Reserved token recipients</Trans>
            </h4>
            <TicketModsList
              mods={editingTicketMods}
              projectId={undefined}
              fundingCycle={undefined}
              reservedRate={parseFloat(
                perbicentToPercent(fcMetadata?.reservedRate),
              )}
            />
          </div>
        </Space>
      </div>

      <Drawer
        open={budgetFormModalVisible}
        {...drawerProps}
        onClose={() => {
          setBudgetFormModalVisible(false)
          setCurrentStep(undefined)
        }}
        destroyOnClose
      >
        <BudgetForm
          initialCurrency={editingFC.currency.toNumber() as V1CurrencyOption}
          initialTarget={fromWad(editingFC.target)}
          initialDuration={editingFC.duration.toString()}
          onSave={async (currency, target, duration) => {
            onBudgetFormSaved(currency, target, duration)
            setBudgetFormModalVisible(false)
            setCurrentStep(undefined)
          }}
        />
      </Drawer>

      <Drawer
        open={payModsModalVisible}
        {...drawerProps}
        onClose={() => {
          setPayModsFormModalVisible(false)
          setCurrentStep(undefined)
        }}
        destroyOnClose
      >
        <PayModsForm
          initialMods={editingPayoutMods}
          currency={editingFC.currency.toNumber() as V1CurrencyOption}
          target={editingFC.target}
          fee={terminalFee}
          onSave={async mods => {
            onPayModsFormSaved(mods)
            setPayModsFormModalVisible(false)
            setCurrentStep(undefined)
          }}
        />
      </Drawer>

      <Drawer
        open={ticketingFormModalVisible}
        {...drawerProps}
        onClose={() => {
          resetTicketingForm()
          setTicketingFormModalVisible(false)
          setCurrentStep(undefined)
        }}
      >
        <TicketingForm
          form={ticketingForm}
          initialMods={editingTicketMods}
          onSave={async mods => {
            await ticketingForm.validateFields()
            onTicketingFormSaved(mods)
            setTicketingFormModalVisible(false)
            setCurrentStep(undefined)
          }}
        />
      </Drawer>

      <ReconfigurationStrategyDrawer
        open={rulesFormModalVisible}
        {...drawerProps}
        onClose={() => {
          setCurrentStep(undefined)
          setRulesFormModalVisible(false)
        }}
        initialSelectedStrategy={getBallotStrategyByAddress(editingFC.ballot)}
        onSave={(strategy: BallotStrategy) => {
          onRulesFormSaved(strategy.address)
          setCurrentStep(undefined)
          setRulesFormModalVisible(false)
        }}
      />

      <Drawer
        open={incentivesFormModalVisible}
        {...drawerProps}
        onClose={() => {
          setIncentivesFormModalVisible(false)
          setCurrentStep(undefined)
        }}
      >
        <IncentivesForm
          form={incentivesForm}
          disableBondingCurve={!hasFundingTarget(editingFC)}
          onSave={async (discountRate: string, bondingCurveRate: string) => {
            await incentivesForm.validateFields()
            onIncentivesFormSaved(discountRate, bondingCurveRate)
            setIncentivesFormModalVisible(false)
            setCurrentStep(undefined)
          }}
        />
      </Drawer>

      {terminal.version === '1.1' && (
        <Drawer
          open={restrictedActionsFormModalVisible}
          {...drawerProps}
          onClose={() => {
            resetRestrictedActionsForm()
            setRestrictedActionsFormModalVisible(false)
            setCurrentStep(undefined)
          }}
        >
          <RestrictedActionsForm
            form={restrictedActionsForm}
            onSave={() => {
              onRestrictedActionsFormSaved()
              setRestrictedActionsFormModalVisible(false)
              setCurrentStep(undefined)
            }}
          />
        </Drawer>
      )}
    </Modal>
  )
}
