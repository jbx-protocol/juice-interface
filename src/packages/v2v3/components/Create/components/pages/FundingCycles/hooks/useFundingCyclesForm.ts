import { useForm, useWatch } from 'antd/lib/form/Form'
import { DurationInputValue } from 'components/inputs/DurationInput'
import moment from 'moment'
import { useDebugValue, useEffect, useMemo } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import {
  DEFAULT_MUST_START_AT_OR_AFTER,
  editingV2ProjectActions,
} from 'redux/slices/editingV2Project'
import {
  deriveDurationUnit,
  otherUnitToSeconds,
  secondsToOtherUnit,
} from 'utils/format/formatTime'

export type FundingCyclesFormProps = Partial<{
  selection: 'automated' | 'manual'
  duration: DurationInputValue
  launchDate: moment.Moment
}>

export const useFundingCyclesForm = () => {
  const [form] = useForm<FundingCyclesFormProps>()
  const { fundingCycleData, fundingCyclesPageSelection, mustStartAtOrAfter } =
    useAppSelector(state => state.editingV2Project)
  useDebugValue(form.getFieldsValue())

  const initialValues: FundingCyclesFormProps | undefined = useMemo(() => {
    const selection = fundingCyclesPageSelection
    const launchDate =
      mustStartAtOrAfter !== DEFAULT_MUST_START_AT_OR_AFTER &&
      !isNaN(parseFloat(mustStartAtOrAfter))
        ? moment.unix(parseFloat(mustStartAtOrAfter))
        : undefined

    if (!fundingCycleData.duration?.length || selection !== 'automated') {
      // Return default values if the user hasn't selected a funding cycle type yet.
      return { duration: { duration: 14, unit: 'days' }, selection, launchDate }
    }

    const durationInSeconds = parseInt(fundingCycleData.duration)
    const durationUnit = deriveDurationUnit(durationInSeconds)
    const duration = secondsToOtherUnit({
      duration: durationInSeconds,
      unit: durationUnit,
    })

    return {
      selection,
      duration: { duration, unit: durationUnit },
      launchDate,
    }
  }, [
    fundingCycleData.duration,
    fundingCyclesPageSelection,
    mustStartAtOrAfter,
  ])

  const dispatch = useAppDispatch()
  const selection = useWatch('selection', form)
  const duration = useWatch('duration', form)
  const launchDate = useWatch('launchDate', form)

  useEffect(() => {
    dispatch(editingV2ProjectActions.setFundingCyclesPageSelection(selection))

    // We need to handle manual case first as duration might be undefined, but
    // manual set.
    if (selection === 'manual') {
      dispatch(editingV2ProjectActions.setDuration('0'))
      return
    }

    if (!selection || duration?.duration === undefined) {
      dispatch(editingV2ProjectActions.setDuration(''))
      return
    }
    if (selection === 'automated') {
      const newDuration = otherUnitToSeconds({
        duration: duration.duration,
        unit: duration.unit,
      })
      dispatch(editingV2ProjectActions.setDuration(newDuration.toString()))
      return
    }
  }, [selection, duration, dispatch])

  useEffect(() => {
    if (launchDate === undefined) return
    if (launchDate === null || !launchDate.unix().toString()) {
      dispatch(
        editingV2ProjectActions.setMustStartAtOrAfter(
          DEFAULT_MUST_START_AT_OR_AFTER,
        ),
      )
      return
    }
    dispatch(
      editingV2ProjectActions.setMustStartAtOrAfter(
        launchDate?.unix().toString(),
      ),
    )
  }, [dispatch, launchDate])

  return { form, initialValues }
}
