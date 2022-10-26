import * as constants from '@ethersproject/constants'
import { Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { readNetwork } from 'constants/networks'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { ReconfigurationStrategy } from 'models/reconfigurationStrategy'
import { useEffect, useMemo } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { useFormDispatchWatch } from '../../hooks'
import { useAvailableReconfigurationStrategies } from './AvailableReconfigurationStrategies'

export type ReconfigurationRulesFormProps = Partial<{
  selection: ReconfigurationStrategy
  customAddress?: string
  pausePayments: boolean
  allowTerminalConfiguration: boolean
}>

export const useReconfigurationRulesForm = () => {
  const [form] = useForm<ReconfigurationRulesFormProps>()
  const strategies = useAvailableReconfigurationStrategies(
    readNetwork.name,
  ).map(({ address, id, isDefault }) => ({ address, name: id, isDefault }))
  const defaultStrategy = useMemo(
    () => strategies.find(s => s.isDefault),
    [strategies],
  )

  if (defaultStrategy === undefined) {
    console.error(
      'Unexpected error - default strategy for reconfiguration is undefined',
      { defaultStrategy, strategies },
    )
    throw new Error(
      'Unexpected error - default strategy for reconfiguration is undefined',
    )
  }

  const {
    fundingCycleData: { ballot },
    reconfigurationRuleSelection,
    fundingCycleMetadata,
  } = useAppSelector(state => state.editingV2Project)
  const initialValues: ReconfigurationRulesFormProps | undefined =
    useMemo(() => {
      const pausePayments = fundingCycleMetadata.pausePay
      const allowTerminalConfiguration =
        fundingCycleMetadata.global.allowSetTerminals
      // By default, ballot is addressZero
      if (!reconfigurationRuleSelection && ballot === constants.AddressZero)
        return {
          selection: defaultStrategy.name,
          pausePayments,
          allowTerminalConfiguration,
        }

      const found = strategies.find(({ address }) => address === ballot)
      if (!found) {
        return {
          selection: 'custom',
          customAddress: ballot,
          pausePayments,
          allowTerminalConfiguration,
        }
      }

      return {
        selection: found.name,
        pausePayments,
        allowTerminalConfiguration,
      }
    }, [
      ballot,
      defaultStrategy.name,
      fundingCycleMetadata.global.allowSetTerminals,
      fundingCycleMetadata.pausePay,
      reconfigurationRuleSelection,
      strategies,
    ])

  const selection = Form.useWatch('selection', form)
  const customAddress = Form.useWatch('customAddress', form)
  const dispatch = useAppDispatch()

  useEffect(() => {
    let address: string | undefined
    switch (selection) {
      case 'threeDay':
      case 'none':
      case 'sevenDay':
        address = strategies.find(s => s.name === selection)?.address
        break
      case 'custom':
        address = customAddress
        break
    }
    dispatch(editingV2ProjectActions.setBallot(address ?? ''))
    dispatch(editingV2ProjectActions.setReconfigurationRuleSelection(selection))
  }, [customAddress, dispatch, selection, strategies])

  useFormDispatchWatch({
    form,
    fieldName: 'pausePayments',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setPausePay,
    formatter: v => !!v,
  })

  useFormDispatchWatch({
    form,
    fieldName: 'allowTerminalConfiguration',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setAllowSetTerminals,
    formatter: v => !!v,
  })

  return { form, initialValues }
}
