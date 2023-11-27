import { Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { useAvailableReconfigurationStrategies } from 'components/Create/hooks/useAvailableReconfigurationStrategies'
import { readNetwork } from 'constants/networks'
import { ReconfigurationStrategy } from 'models/reconfigurationStrategy'
import { useEffect, useMemo } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { isEqualAddress, isZeroAddress } from 'utils/address'
import { useFormDispatchWatch } from '../../hooks/useFormDispatchWatch'

type ReconfigurationRulesFormProps = Partial<{
  selection: ReconfigurationStrategy
  customAddress?: string
  pausePayments: boolean
  holdFees: boolean
  pauseTransfers: boolean
  allowTerminalConfiguration: boolean
  allowControllerConfiguration: boolean
  allowTerminalMigration: boolean
  allowControllerMigration: boolean
  projectRequiredOFACCheck: boolean
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
      const allowControllerConfiguration =
        fundingCycleMetadata.global.allowSetController
      const allowTerminalMigration = fundingCycleMetadata.allowTerminalMigration
      const allowControllerMigration =
        fundingCycleMetadata.allowControllerMigration
      const pauseTransfers = fundingCycleMetadata.global.pauseTransfers
      const holdFees = fundingCycleMetadata.holdFees
      // By default, ballot is addressZero
      if (!reconfigurationRuleSelection && isZeroAddress(ballot))
        return {
          selection: defaultStrategy.name,
          pausePayments,
          pauseTransfers,
          allowTerminalConfiguration,
          allowControllerConfiguration,
          allowTerminalMigration,
          allowControllerMigration,
        }

      const found = strategies.find(({ address }) =>
        isEqualAddress(address, ballot),
      )
      if (!found) {
        return {
          selection: 'custom',
          customAddress: ballot,
          pausePayments,
          allowTerminalConfiguration,
          allowControllerConfiguration,
          pauseTransfers,
          holdFees,
        }
      }

      return {
        selection: found.name,
        pausePayments,
        pauseTransfers,
        holdFees,
        allowTerminalConfiguration,
        allowControllerConfiguration,
        allowTerminalMigration,
        allowControllerMigration,
      }
    }, [
      fundingCycleMetadata.pausePay,
      fundingCycleMetadata.global,
      fundingCycleMetadata.holdFees,
      fundingCycleMetadata.allowTerminalMigration,
      fundingCycleMetadata.allowControllerMigration,
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
    fieldName: 'holdFees',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setHoldFees,
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
    fieldName: 'allowControllerConfiguration',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setAllowSetController,
    formatter: v => !!v,
  })

  useFormDispatchWatch({
    form,
    fieldName: 'allowTerminalMigration',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setAllowTerminalMigration,
    formatter: v => !!v,
  })

  useFormDispatchWatch({
    form,
    fieldName: 'allowControllerMigration',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setAllowControllerMigration,
    formatter: v => !!v,
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectRequiredOFACCheck',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setRequiredOFACCheck,
    formatter: v => v,
  })

  return { form, initialValues }
}
