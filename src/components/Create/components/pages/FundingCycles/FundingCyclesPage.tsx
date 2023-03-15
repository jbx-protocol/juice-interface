import {
  CheckCircleFilled,
  InfoCircleOutlined,
  RedoOutlined,
} from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Form, Space, Tooltip } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import { useLockPageRulesWrapper } from 'components/Create/hooks/useLockPageRulesWrapper'
import { DurationInput } from 'components/inputs/DurationInput'
import { JuiceDatePicker } from 'components/inputs/JuiceDatePicker'
import { CREATE_FLOW } from 'constants/fathomEvents'
import { trackFathomGoal } from 'lib/fathom'
import moment from 'moment'
import Link from 'next/link'
import { useContext, useEffect } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { durationMustExistRule } from 'utils/antdRules'
import { CreateBadge } from '../../CreateBadge'
import { CreateCollapse } from '../../CreateCollapse'
import { Icons } from '../../Icons'
import { OptionalHeader } from '../../OptionalHeader'
import { Selection } from '../../Selection/Selection'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { FundingCyclesFormProps, useFundingCyclesForm } from './hooks'

const FundingCycleCallout: React.FC = () => {
  const form = Form.useFormInstance<FundingCyclesFormProps>()
  const selection = useWatch('selection', form)

  if (!selection) return null

  switch (selection) {
    case 'automated':
      return (
        <Callout.Warning>
          <Space direction="vertical" size="middle">
            <Trans>
              Cycle #1 starts when you create your project. With locked cycles,
              if you attempt to edit your project's rules during Cycle #1, those
              edits will be <em>queued</em> for the next cycle.
            </Trans>
            <Trans>
              In other words: instead of going into effect immediately, those
              edits will go into effect when the next cycle starts (Cycle #2).
              If you need more flexibility, switch to unlocked cycles.
            </Trans>
          </Space>
        </Callout.Warning>
      )
    case 'manual':
      return (
        <Callout.Warning>
          <Trans>
            Cycle #1 starts when you create your project. With unlocked cycles,
            you can edit your project's rules at any time. This gives you more
            flexibility, but may appear risky to supporters. Switching to locked
            cycles will help you build supporter confidence.
          </Trans>
        </Callout.Warning>
      )
  }
}

export const FundingCyclesPage = () => {
  useSetCreateFurthestPageReached('fundingCycles')
  const { goToNextPage, lockPageProgress, unlockPageProgress } =
    useContext(PageContext)
  const { form, initialValues } = useFundingCyclesForm()
  const lockPageRulesWrapper = useLockPageRulesWrapper()

  const launchDate = useWatch('launchDate', form)
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
      onFinish={() => {
        goToNextPage?.()
        trackFathomGoal(CREATE_FLOW.CYCLES_NEXT_CTA)
      }}
      scrollToFirstError
    >
      <Space className="w-full" direction="vertical" size="large">
        <Space className="w-full" direction="vertical" size="large">
          <Form.Item noStyle name="selection">
            <Selection className="w-full" defocusOnSelect>
              <Selection.Card
                name="automated"
                title={
                  <div className="inline-flex items-center gap-3">
                    <Trans>Locked Cycles</Trans>{' '}
                    <CreateBadge.Recommended
                      tooltip={
                        <span>
                          <Trans>
                            <p>
                              With Locked Cycles, your project's rules are
                              locked for a period of time.
                            </p>
                            <p>
                              <strong>
                                This helps build trust with your contributors.
                              </strong>
                            </p>
                          </Trans>
                        </span>
                      }
                    />
                  </div>
                }
                description={t`Set a duration for locked cycles.`}
                icon={<RedoOutlined />}
              >
                <Form.Item
                  name="duration"
                  label={t`Cycle duration`}
                  extra={
                    <Trans>
                      <InfoCircleOutlined /> Your project’s rules cannot be
                      edited during the first cycle.
                    </Trans>
                  }
                  rules={lockPageRulesWrapper([
                    durationMustExistRule({ label: t`Cycle duration` }),
                  ])}
                >
                  <DurationInput />
                </Form.Item>
              </Selection.Card>
              <Selection.Card
                name="manual"
                title={t`Unlocked Cycles`}
                description={t`The project’s owner can edit the project's rules and start new cycles at any time.`}
                icon={<Icons.ManualSettings />}
              />
            </Selection>
          </Form.Item>
          {selection && (
            <CreateCollapse>
              <CreateCollapse.Panel
                header={
                  <div className="flex items-center gap-3">
                    <OptionalHeader header={t`Schedule launch`} />
                    {launchDate && (
                      <CheckCircleFilled className="text-lg leading-none text-bluebs-500" />
                    )}
                  </div>
                }
                key={0}
                hideDivider
              >
                <Form.Item
                  label={
                    <span className="text-sm font-normal">
                      <Trans>
                        Set a future date & time to start your project's first
                        cycle.
                      </Trans>
                    </span>
                  }
                  extra={
                    launchDate ? (
                      <Trans>
                        Your project’s first cycle will start on{' '}
                        <Tooltip
                          title={
                            launchDate.clone().format('YYYY-MM-DD') +
                            ' at ' +
                            launchDate.clone().utc().format('HH:mm:ss z')
                          }
                        >
                          {launchDate.clone().format('YYYY-MM-DD')} at{' '}
                          {launchDate.clone().format('HH:mm:ss z')}
                        </Tooltip>
                        . Your project will be visible on{' '}
                        <Link href="/">juicebox.money</Link> once you finish
                        setting your project up, but supporters won't be able to
                        pay or interact with it until the first cycle begins.
                      </Trans>
                    ) : (
                      <Trans>
                        Leave this blank to start your first cycle immediately
                        after you finish setting up your project.
                      </Trans>
                    )
                  }
                >
                  <Form.Item name="launchDate" noStyle>
                    <JuiceDatePicker
                      showNow={false}
                      showToday={false}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={current =>
                        current && current < moment().endOf('day')
                      }
                      showTime={{ defaultValue: moment('00:00:00') }}
                    />
                  </Form.Item>
                </Form.Item>
              </CreateCollapse.Panel>
            </CreateCollapse>
          )}
        </Space>
        <FundingCycleCallout />
      </Space>
      <Wizard.Page.ButtonControl isNextEnabled={isNextEnabled} />
    </Form>
  )
}

// TODO: I really wanted this to work. If anyone can make it work, go for it.
// const DateTimePicker: React.FC = ({
//   value,
//   onChange,
// }: {
//   value: moment.Moment | null
//   onChange: (val: moment.Moment | null) => void
// }) => {
//   const [date, setDate] = useState<moment.Moment | null>(null)

//   const disabledDate = useCallback((date: moment.Moment) => {
//     const now = moment()
//     return date.startOf('day').isBefore(now.startOf('day'))
//   }, [])

//   const disabledTime = useCallback(() => {
//     const now = moment()
//     if (date && date.isSame(now, 'day')) {
//       const disabledHours = range(0, 24).splice(0, now.hour() + 1)
//       return {
//         disabledHours: () => disabledHours,
//       }
//     }
//     return {}
//   }, [date])

//   const onDateChanged = useCallback(
//     (value: moment.Moment | null) => {
//       console.log('onDateChanged', value)
//       // Value will always set to 00:00:00, so adjust accordingly

//       if (!value) {
//         setDate(null)
//         return
//       }

//       console.log('date', date)
//       const previousTime = date
//         ?.clone()
//         .day(value.day())
//         .month(value.month())
//         .year(value.year())

//       console.log('previousTime', previousTime)

//       const now = moment()

//       if (value.isSame(now, 'day')) {
//         if (previousTime) {
//           if (previousTime < now.add(1, 'hour')) {
//             setDate(now.clone().add(1, 'hour').startOf('minute'))
//           } else {
//             setDate(previousTime.clone())
//           }
//           return
//         }
//         setDate(now.clone().add(1, 'hour').startOf('minute'))
//         return
//       }

//       setDate(previousTime?.clone() ?? value.clone())

//       // console.log('wraeth', { hour: value.hour(), minute: value.minute() })
//       // if (value.hour() === 0 && value.minute() === 0) {
//       //   // set newDate hour to 11
//       //   // set newDate minute to 59
//       //   const newDate = value
//       //     .clone()
//       //     .hour(now.hour())
//       //     .minute(now.minute())
//       //     .second(0)
//       //   setDate(newDate)
//       //   return
//       // }

//       // setDate(value)
//     },
//     [date],
//   )

//   const onTimeChanged = useCallback(
//     (value: moment.Moment | null) => {
//       console.log('onTimeChanged', value)
//       if (!value || !date) {
//         return
//       }
//       const newDate = date
//         .hour(value.hour())
//         .minute(value.minute())
//         .second(value.second())
//       setDate(newDate.clone())
//     },
//     [date],
//   )

//   const onClearClicked = useCallback(() => {
//     setDate(null)
//   }, [])

//   return (
//     <span className="flex items-center gap-3">
//       <JuiceDatePicker
//         picker="date"
//         disabledDate={disabledDate}
//         value={date}
//         onChange={onDateChanged}
//       />
//       {date && (
//         <JuiceDatePicker
//           showNow={false}
//           allowClear={false}
//           disabledTime={disabledTime}
//           value={date}
//           onChange={onTimeChanged}
//           // value={time}
//           // onChange={onTimeChanged}
//           picker="time"
//         />
//       )}
//       {date && (
//         <CloseCircleFilled
//           className="text-lg leading-none text-grey-500"
//           onClick={onClearClicked}
//         />
//       )}
//     </span>
//   )
// }
