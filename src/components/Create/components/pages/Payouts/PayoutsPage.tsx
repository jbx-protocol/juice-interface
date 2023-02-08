import { FieldBinaryOutlined, PercentageOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Form, Space, Tooltip } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { useContext, useEffect, useMemo } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { allocationTotalPercentDoNotExceedTotalRule } from 'utils/antdRules'
import { Selection } from '../../Selection'
import { SelectionCardProps } from '../../Selection/SelectionCard'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { PayoutsList } from './components/PayoutsList'
import { useAvailablePayoutsSelections, usePayoutsForm } from './hooks'

export const PayoutsPage: React.FC = () => {
  useSetCreateFurthestPageReached('payouts')
  const { goToNextPage, lockPageProgress, unlockPageProgress } =
    useContext(PageContext)
  const { form, initialValues } = usePayoutsForm()
  const availableSelections = useAvailablePayoutsSelections()

  const selection = useWatch('selection', form)
  const payoutsList = useWatch('payoutsList', form)

  const expensesExceedsFundingTarget = useMemo(() => {
    const totalPercent =
      payoutsList?.reduce((acc, allocation) => acc + allocation.percent, 0) ?? 0
    return totalPercent > 100
  }, [payoutsList])

  // Lock the page of the input data is invalid.
  useEffect(() => {
    if (expensesExceedsFundingTarget || !selection) {
      lockPageProgress?.()
      return
    }
    unlockPageProgress?.()
  }, [
    expensesExceedsFundingTarget,
    lockPageProgress,
    selection,
    unlockPageProgress,
  ])

  const isNextEnabled = !!selection && !expensesExceedsFundingTarget

  return (
    <Form
      form={form}
      initialValues={initialValues}
      name="fundingTarget"
      colon={false}
      layout="vertical"
      onFinish={goToNextPage}
      scrollToFirstError
    >
      <Space className="w-full" direction="vertical" size="large">
        <h3 className="text-lg font-medium text-black dark:text-grey-200">
          <Trans>How would you like to distribute payments?</Trans>
        </h3>
        <Form.Item noStyle name="selection">
          <Selection
            className="w-full"
            disableInteractivity={availableSelections.size === 1}
            defocusOnSelect
          >
            <DisabledTooltip
              name="percentages"
              title={t`Percentages`}
              icon={<PercentageOutlined />}
              isDisabled={!availableSelections.has('percentages')}
              fundingTargetDisabledReason={t`zero`}
              description={
                <Trans>
                  Distribute a percentage of all funds received between the
                  entities nominated in the next step.
                </Trans>
              }
            />
            <DisabledTooltip
              name="amounts"
              title={t`Specific Amounts`}
              icon={<FieldBinaryOutlined />}
              isDisabled={!availableSelections.has('amounts')}
              fundingTargetDisabledReason={t`infinite`}
              description={
                <Trans>
                  Distribute a specific amount of funds to each entity nominated
                  in the next step.
                </Trans>
              }
            />
          </Selection>
        </Form.Item>
        {selection && (
          <Space className="w-full" direction="vertical">
            <h3 className="text-lg font-medium text-black dark:text-grey-200">
              <Trans>Who's getting paid?</Trans>
            </h3>
            <p>
              <Trans>
                Add payouts to wallet addresses or Juicebox projects.
              </Trans>
            </p>
            <Form.Item
              className="mb-0"
              name="payoutsList"
              rules={[allocationTotalPercentDoNotExceedTotalRule()]}
            >
              <PayoutsList payoutsSelection={selection} />
            </Form.Item>
          </Space>
        )}
      </Space>
      <Wizard.Page.ButtonControl isNextEnabled={isNextEnabled} />
    </Form>
  )
}

const DisabledTooltip = (
  props: SelectionCardProps & { fundingTargetDisabledReason: string },
) => (
  <Tooltip
    title={
      props.isDisabled ? (
        <Trans>
          {props.title} is disabled when <b>Funding Target</b> is{' '}
          {props.fundingTargetDisabledReason}.
        </Trans>
      ) : undefined
    }
  >
    <div>
      <Selection.Card {...props} />
    </div>
  </Tooltip>
)
