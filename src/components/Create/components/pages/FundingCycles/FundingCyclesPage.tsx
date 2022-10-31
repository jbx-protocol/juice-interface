import { InfoCircleOutlined, RedoOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { useLockPageRulesWrapper } from 'components/Create/hooks/useLockPageRulesWrapper'
import { useContext, useEffect } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { CreateBadge } from '../../CreateBadge'
import { CreateCallout } from '../../CreateCallout'
import { DurationInput } from '../../DurationInput'
import { Icons } from '../../Icons'
import { Selection } from '../../Selection/Selection'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { durationMustExistRule } from '../utils'
import { FundingCyclesFormProps, useFundingCyclesForm } from './hooks'

const FundingCycleCallout: React.FC = () => {
  const form = Form.useFormInstance<FundingCyclesFormProps>()
  const selection = useWatch('selection', form)

  if (!selection) return null

  switch (selection) {
    case 'automated':
      return (
        <CreateCallout.Warning>
          <Space direction="vertical" size="middle">
            <Trans>
              Funding Cycle #1 will start immediately after you launch your
              project. You can't reconfigure Funding Cycle #1 after launch.
            </Trans>
            <Trans>
              You can reconfigure your project's next funding cycle (Funding
              Cycle #2) at any time within the bounds of the rules you set.
            </Trans>
          </Space>
        </CreateCallout.Warning>
      )
    case 'manual':
      return (
        <CreateCallout.Warning>
          <Trans>
            With manual funding cycles selected, the project's owner can start a
            new funding cycle on-demand. This may pose a risk to some
            contributors.
          </Trans>
        </CreateCallout.Warning>
      )
  }
}

export const FundingCyclesPage = () => {
  useSetCreateFurthestPageReached('fundingCycles')
  const { goToNextPage, lockPageProgress, unlockPageProgress } =
    useContext(PageContext)
  const { form, initialValues } = useFundingCyclesForm()
  const lockPageRulesWrapper = useLockPageRulesWrapper()

  const selection = useWatch('selection', form)
  const isNextEnabled = !!selection

  // A bit of a workaround to soft lock the page when the user edits data.
  useEffect(() => {
    if (!selection) {
      lockPageProgress?.()
      return
    }
    if (selection === 'automated') {
      const duration = form.getFieldValue('duration')
      if (!duration?.duration) {
        lockPageProgress?.()
        return
      }
    }
    unlockPageProgress?.()
  }, [form, isNextEnabled, lockPageProgress, selection, unlockPageProgress])

  return (
    <Form
      form={form}
      initialValues={initialValues}
      name="fundingCycles"
      colon={false}
      layout="vertical"
      onFinish={goToNextPage}
      scrollToFirstError
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Form.Item noStyle name="selection">
            <Selection defocusOnSelect style={{ width: '100%' }}>
              <Selection.Card
                name="automated"
                title={
                  <Trans>
                    Automated Funding Cycles <CreateBadge.Recommended />
                  </Trans>
                }
                description={t`Set a duration for automatically recurring funding cycles. Funds may only be distributed once per cycle.`}
                icon={<RedoOutlined />}
              >
                <Form.Item
                  name="duration"
                  label={t`Funding cycle duration`}
                  extra={
                    <Trans>
                      <InfoCircleOutlined /> Your project’s settings cannot be
                      edited or changed during the first funding cycle.
                    </Trans>
                  }
                  rules={lockPageRulesWrapper([
                    durationMustExistRule({ label: t`Funding cycle duration` }),
                  ])}
                >
                  <DurationInput />
                </Form.Item>
              </Selection.Card>
              <Selection.Card
                name="manual"
                title={t`Manual Funding Cycles`}
                description={t`The project’s owner can change the project's settings and start a new funding cycle at any time.`}
                icon={<Icons.ManualSettings />}
              />
            </Selection>
          </Form.Item>
        </Space>
        <FundingCycleCallout />
      </Space>
      <Wizard.Page.ButtonControl isNextEnabled={isNextEnabled} />
    </Form>
  )
}
