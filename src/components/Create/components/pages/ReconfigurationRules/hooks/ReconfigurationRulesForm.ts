import * as constants from '@ethersproject/constants'
import { Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { useAvailableReconfigurationStrategies } from 'components/Create/hooks/AvailableReconfigurationStrategies'
import { readNetwork } from 'constants/networks'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { ReconfigurationStrategy } from 'models/reconfigurationStrategy'
import { useEffect, useMemo } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { useFormDispatchWatch } from '../../hooks'

type ReconfigurationRulesFormProps = Partial<{
  selection: ReconfigurationStrategy
  customAddress?: string
  pausePayments: boolean
  allowTerminalConfiguration: boolean
  holdFees: boolean
  pauseTransfers: boolean
  useDataSourceForRedeem: boolean
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
      const pauseTransfers = fundingCycleMetadata.global.pauseTransfers
      const holdFees = fundingCycleMetadata.holdFees
      // By default, ballot is addressZero
      if (!reconfigurationRuleSelection && ballot === constants.AddressZero)
        return {
          selection: defaultStrategy.name,
          pausePayments,
          allowTerminalConfiguration,
          pauseTransfers,
        }

      const found = strategies.find(({ address }) => address === ballot)
      if (!found) {
        return {
          selection: 'custom',
          customAddress: ballot,
          pausePayments,
          allowTerminalConfiguration,
          pauseTransfers,
          holdFees,
        }
      }

      return {
        selection: found.name,
        pausePayments,
        allowTerminalConfiguration,
        pauseTransfers,
        holdFees,
      }
    }, [
      fundingCycleMetadata.pausePay,
      fundingCycleMetadata.global.allowSetTerminals,
      fundingCycleMetadata.global.pauseTransfers,
      fundingCycleMetadata.holdFees,
      reconfigurationRuleSelection,
      ballot,
      defaultStrategy.name,
      strategies,
    ])

  const selection = Form.useWatch('selection', form)
  const customAddress = Form.useWatch('customAddress', form)
  const dispatch = useAppDispatch()

  useEffect(() => {
    let address: string | undefined
    switch (selection) {
      case 'threeDay':
      case 'oneDay':
        address = strategies.find(s => s.name === selection)?.address
        break
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

  useFormDispatchWatch({
    form,
    fieldName: 'pauseTransfers',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setPauseTransfers,
    formatter: v => !!v,
  })

  useFormDispatchWatch({
    form,
    fieldName: 'holdFees',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setHoldFees,
    formatter: v => !!v,
  })

  useFormDispatchWatch({
    form,
    fieldName: 'useDataSourceForRedeem',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setUseDataSourceForRedeem,
    formatter: v => !!v,
  })

  return { form, initialValues }
}
