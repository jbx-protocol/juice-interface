import { useForm, useWatch } from 'antd/lib/form/Form'
import { DurationInputValue } from 'components/Create/components/DurationInput'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { useDebugValue, useEffect, useMemo } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import {
  deriveDurationUnit,
  otherUnitToSeconds,
  secondsToOtherUnit,
} from 'utils/format/formatTime'

export type FundingCyclesFormProps = Partial<{
  selection: 'automated' | 'manual'
  duration: DurationInputValue
}>

export const useFundingCyclesForm = () => {
  const [form] = useForm<FundingCyclesFormProps>()
  const { fundingCycleData } = useAppSelector(state => state.editingV2Project)
  useDebugValue(form.getFieldsValue())

  const initialValues: FundingCyclesFormProps | undefined = useMemo(() => {
    if (!fundingCycleData.duration?.length) {
      return undefined
    }

    const selection = fundingCycleData.duration === '0' ? 'manual' : 'automated'

    const durationInSeconds = parseInt(fundingCycleData.duration)
    const durationUnit = deriveDurationUnit(durationInSeconds)
    const duration = secondsToOtherUnit({
      duration: durationInSeconds,
      unit: durationUnit,
    })

    return {
      selection,
      duration: { duration, unit: durationUnit },
    }
  }, [fundingCycleData.duration])

  const dispatch = useAppDispatch()
  const selection = useWatch('selection', form)
  const duration = useWatch('duration', form)

  useEffect(() => {
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

  return { form, initialValues }
}
