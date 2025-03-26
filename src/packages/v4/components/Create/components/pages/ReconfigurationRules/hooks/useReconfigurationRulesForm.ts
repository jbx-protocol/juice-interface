import { useEffect, useMemo } from 'react'
import { isEqualAddress, isZeroAddress } from 'utils/address'

import { Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ReconfigurationStrategy } from 'models/reconfigurationStrategy'
import { getAvailableApprovalStrategies } from 'packages/v4/utils/approvalHooks'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { creatingV2ProjectActions } from 'redux/slices/v2v3/creatingV2Project'
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
  const strategies = getAvailableApprovalStrategies()
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
  } = useAppSelector(state => state.creatingV2Project)
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
          selection: defaultStrategy.id,
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
        selection: found.id,
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
      defaultStrategy.id,
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
    dispatch(creatingV2ProjectActions.setBallot(address ?? ''))
    dispatch(
      creatingV2ProjectActions.setReconfigurationRuleSelection(selection),
    )
  }, [customAddress, dispatch, selection, strategies])

  useFormDispatchWatch({
    form,
    fieldName: 'pausePayments',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setPausePay,
    formatter: v => !!v,
  })

  useFormDispatchWatch({
    form,
    fieldName: 'holdFees',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setHoldFees,
    formatter: v => !!v,
  })

  useFormDispatchWatch({
    form,
    fieldName: 'allowTerminalConfiguration',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setAllowSetTerminals,
    formatter: v => !!v,
  })

  useFormDispatchWatch({
    form,
    fieldName: 'allowControllerConfiguration',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setAllowSetController,
    formatter: v => !!v,
  })

  useFormDispatchWatch({
    form,
    fieldName: 'allowTerminalMigration',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setAllowTerminalMigration,
    formatter: v => !!v,
  })

  useFormDispatchWatch({
    form,
    fieldName: 'allowControllerMigration',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setAllowControllerMigration,
    formatter: v => !!v,
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectRequiredOFACCheck',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setRequiredOFACCheck,
    formatter: v => v,
  })

  return { form, initialValues }
}
