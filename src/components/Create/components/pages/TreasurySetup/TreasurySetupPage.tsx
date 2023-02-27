import { StopOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { RadioGroup } from '@headlessui/react'
import { t, Trans } from '@lingui/macro'
import { Divider, Form } from 'antd'
import { Callout } from 'components/Callout'
import { DeleteConfirmationModal } from 'components/modals/DeleteConfirmationModal'
import TooltipLabel from 'components/TooltipLabel'
import { useModal } from 'hooks/Modal'
import { PayoutsSelection } from 'models/payoutsSelection'
import { TreasurySelection } from 'models/treasurySelection'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from 'redux/hooks/AppDispatch'
import { useAppSelector } from 'redux/hooks/AppSelector'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import {
  ReduxDistributionLimit,
  useEditingDistributionLimit,
} from 'redux/hooks/EditingDistributionLimit'
import { useEditingPayoutSplits } from 'redux/hooks/EditingPayoutSplits'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { allocationTotalPercentDoNotExceedTotalRule } from 'utils/antdRules'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { Icons } from '../../Icons'
import { useFundingTarget } from '../../RecallCard/hooks'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { ConvertAmountsModal, RadioCard } from './components'
import { PayoutsList } from './components/PayoutsList'
import { useTreasurySetupForm } from './hooks'

const treasuryOptions = [
  { name: t`Amount`, value: 'amount', icon: <Icons.Target /> },
  { name: t`Unlimited`, value: 'unlimited', icon: <Icons.Infinity /> },
  { name: t`Zero`, value: 'zero', icon: <StopOutlined /> },
]

export const TreasurySetupPage = () => {
  useSetCreateFurthestPageReached('treasurySetup')
  const { goToNextPage } = useContext(PageContext)
  const { form, initialValues } = useTreasurySetupForm()
  const fundingTarget = useFundingTarget()
  const [splits, setSplits] = useEditingPayoutSplits()
  const [distributionLimit, setDistributionLimit] =
    useEditingDistributionLimit()
  const switchingToAmountsModal = useModal()
  const switchingToZeroAmountsModal = useModal()
  const dispatch = useAppDispatch()
  const initialTreasurySelection = useAppSelector(
    state => state.editingV2Project.treasurySelection,
  )

  const [treasuryOption, setTreasuryOption] = useState<TreasurySelection>(
    initialTreasurySelection ?? 'amount',
  )

  const payoutsList = Form.useWatch('payoutsList', form) ?? []

  const calloutText = useMemo(() => {
    switch (treasuryOption) {
      case 'amount':
        return t`The total sum of your payouts will become your distribution limit.
      This is the amount of funds your project will be able to distribute or
      'withdraw' from its treasury each funding cycle.`
      case 'unlimited':
        return t`Your project will keep all funds raised. There will be no limit on the amount of funds you can distribute from your treasury each funding cycle.`
      case 'zero':
        return t`All funds raised will be redeemable by your project’s token holders. You can turn off redemptions in the Token settings. You will not be able to add payouts while your distribution limit is set to Zero.`
    }
  }, [treasuryOption])

  const payoutsSelection: PayoutsSelection | undefined = useMemo(() => {
    switch (treasuryOption) {
      case 'amount':
        return 'amounts'
      case 'unlimited':
        return 'percentages'
      default:
        return undefined
    }
  }, [treasuryOption])

  const conditionsToProceedMet = useMemo(() => {
    switch (treasuryOption) {
      case 'amount':
        return !!payoutsList.length
      default:
        return true
    }
  }, [payoutsList.length, treasuryOption])

  const switchToAmountsPayoutSelection = useCallback(
    (newDistributionLimit: ReduxDistributionLimit) => {
      setDistributionLimit(newDistributionLimit)
      setTreasuryOption('amount')
      switchingToAmountsModal.close()
    },
    [setDistributionLimit, switchingToAmountsModal],
  )
  const switchToZeroPayoutSelection = useCallback(() => {
    setSplits([])
    setDistributionLimit({
      amount: BigNumber.from(0),
      currency: distributionLimit?.currency ?? V2V3_CURRENCY_ETH,
    })
    form.setFieldValue('payoutsList', [])
    setTreasuryOption('zero')
    switchingToZeroAmountsModal.close()
  }, [
    distributionLimit?.currency,
    form,
    setDistributionLimit,
    setSplits,
    switchingToZeroAmountsModal,
  ])

  const onTreasuryOptionChange = useCallback(
    (option: TreasurySelection) => {
      const currentOption = treasuryOption
      const payoutsCreated = payoutsList.length
      if (option === currentOption) return
      if (option === 'amount' && payoutsCreated) {
        switchingToAmountsModal.open()
        return
      } else if (option === 'amount' && !payoutsCreated) {
        setDistributionLimit({
          amount: BigNumber.from(0),
          currency: distributionLimit?.currency ?? V2V3_CURRENCY_ETH,
        })
      }

      if (option === 'unlimited') {
        setDistributionLimit({
          amount: MAX_DISTRIBUTION_LIMIT,
          currency: distributionLimit?.currency ?? V2V3_CURRENCY_ETH,
        })
      }
      if (option === 'zero' && payoutsCreated) {
        switchingToZeroAmountsModal.open()
        return
      } else if (option === 'zero' && !payoutsCreated) {
        switchToZeroPayoutSelection()
      }

      setTreasuryOption(option)
    },
    [
      treasuryOption,
      payoutsList.length,
      switchingToAmountsModal,
      setDistributionLimit,
      distributionLimit?.currency,
      switchingToZeroAmountsModal,
      switchToZeroPayoutSelection,
    ],
  )

  // Initial load
  useEffect(() => {
    if (initialTreasurySelection === undefined) {
      dispatch(editingV2ProjectActions.setDistributionLimit('0'))
    }
  })

  useEffect(() => {
    dispatch(editingV2ProjectActions.setTreasurySelection(treasuryOption))
  }, [dispatch, treasuryOption])

  const showPayouts =
    treasuryOption === 'amount' || treasuryOption === 'unlimited'

  const hasAllocations =
    !!splits.length ||
    (distributionLimit?.amount.gt(0) &&
      distributionLimit.amount.lt(MAX_DISTRIBUTION_LIMIT))

  const isNextEnabled = !!treasuryOption && conditionsToProceedMet

  return (
    <>
      <Form
        form={form}
        initialValues={initialValues}
        layout="vertical"
        onFinish={() => {
          goToNextPage?.()
        }}
      >
        <Form.Item
          label={
            <TooltipLabel
              className="text-lg font-medium text-black dark:text-grey-200"
              label={<Trans>Distribution Limit</Trans>}
              tip={
                <Trans>
                  This is the amount of funds your project will be able to
                  distribute or 'withdraw' from its treasury each funding cycle.
                </Trans>
              }
            />
          }
        >
          <RadioGroup
            className="flex flex-col gap-3 md:flex-row"
            value={treasuryOption}
            onChange={onTreasuryOptionChange}
          >
            {treasuryOptions.map(option => (
              <RadioGroup.Option
                className="flex-1 cursor-pointer"
                key={option.name}
                value={option.value}
              >
                {({ checked }) => (
                  <RadioCard
                    icon={option.icon}
                    title={option.name}
                    checked={checked}
                  />
                )}
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </Form.Item>
        {calloutText && (
          <Callout.Info className="mb-10">{calloutText}</Callout.Info>
        )}
        {showPayouts && (
          <Form.Item
            label={
              <TooltipLabel
                className="text-lg font-medium text-black dark:text-grey-200"
                label={<Trans>Payouts</Trans>}
                tip={
                  <Trans>
                    These are the addresses or entities that will receive
                    payouts from your treasury each funding cycle.
                  </Trans>
                }
              />
            }
          >
            <div className="mb-4">
              <Trans>
                Add wallet addresses or juicebox projects to receive payouts.
              </Trans>
            </div>
            {payoutsSelection && (
              <Form.Item
                shouldUpdate
                name="payoutsList"
                rules={[allocationTotalPercentDoNotExceedTotalRule()]}
              >
                <PayoutsList payoutsSelection={payoutsSelection} />
              </Form.Item>
            )}
          </Form.Item>
        )}
        {treasuryOption !== 'zero' && (
          <>
            {hasAllocations && (
              <>
                <Divider className="mt-4 mb-5" />
                <div className="flex items-center">
                  <span className="font-medium">
                    <Trans>Distribution Limit: {fundingTarget}</Trans>
                  </span>
                </div>
                <Divider className="my-5" />
              </>
            )}
            <span className="text-grey-500 dark:text-slate-300">
              {hasAllocations && treasuryOption === 'amount' ? (
                <Trans>
                  Any funds raised over this amount may be redeemed by your
                  project's token holders. You can turn off redemptions in the
                  Token settings. Payouts to Ethereum wallets will incur a 2.5%
                  fee. Sending funds to other Juicebox projects will not incur
                  any fees. Learn more about fees.
                </Trans>
              ) : (
                <Trans>
                  Payouts to Ethereum wallets will incur a 2.5% fee. Sending
                  funds to other Juicebox projects will not incur any fees.
                  Learn more about fees.
                </Trans>
              )}
            </span>
          </>
        )}
        <Wizard.Page.ButtonControl isNextEnabled={isNextEnabled} />
      </Form>

      <DeleteConfirmationModal
        body={t`Choosing zero will delete all payouts and set your distribution limit to 0.`}
        open={switchingToZeroAmountsModal.visible}
        onOk={switchToZeroPayoutSelection}
        onCancel={switchingToZeroAmountsModal.close}
      />
      <ConvertAmountsModal
        open={switchingToAmountsModal.visible}
        onOk={switchToAmountsPayoutSelection}
        onCancel={switchingToAmountsModal.close}
      />
    </>
  )
}
