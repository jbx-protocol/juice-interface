import { t, Trans } from '@lingui/macro'
import { Modal, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useCallback, useContext, useLayoutEffect, useState } from 'react'
import { CaretRightFilled } from '@ant-design/icons'

import { V2ProjectContext } from 'contexts/v2/projectContext'

import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { fromWad } from 'utils/formatNumber'
import { useAppDispatch } from 'hooks/AppDispatch'

import {
  useAppSelector,
  useEditingV2FundAccessConstraintsSelector,
  useEditingV2FundingCycleDataSelector,
  useEditingV2FundingCycleMetadataSelector,
} from 'hooks/AppSelector'
import { useReconfigureV2FundingCycleTx } from 'hooks/v2/transactor/ReconfigureV2FundingCycleTx'

import { V2ReconfigureProjectDetailsDrawer } from './drawers/V2ReconfigureProjectDetailsDrawer'
import { V2ReconfigureFundingDrawer } from './drawers/V2ReconfigureFundingDrawer'

function ReconfigureButton({
  title,
  onClick,
}: {
  title: string
  onClick: () => void
}) {
  const { colors, radii } = useContext(ThemeContext).theme

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        cursor: 'pointer',
        padding: 10,
        fontWeight: 500,
        borderRadius: radii.sm,
        border: '1px solid ' + colors.stroke.action.secondary,
      }}
      onClick={onClick}
    >
      <div>{title}</div>
      <div>
        <CaretRightFilled />
      </div>
    </div>
  )
}

export const FundingDrawersSubtitles = (
  <p>
    <Trans>
      Updates you make to this section will only be applied to <i>upcoming</i>{' '}
      funding cycles.
    </Trans>
  </p>
)

export default function V2ProjectReconfigureModal({
  visible,
  onOk,
}: {
  visible: boolean
  onOk: () => void
}) {
  const {
    queuedFundingCycle,
    fundingCycle,
    payoutSplits,
    queuedPayoutSplits,
    distributionLimit,
    queuedDistributionLimit,
  } = useContext(V2ProjectContext)

  const dispatch = useAppDispatch()

  const [projectDetailsDrawerVisible, setProjectDetailsDrawerVisible] =
    useState<boolean>(false)
  const [fundingDrawerVisible, setFundingDrawerVisible] =
    useState<boolean>(false)

  const [fundingHasSavedChanges, setFundingHasSavedChanges] =
    useState<boolean>(false)
  const [reconfigureTxLoading, setReconfigureTxLoading] =
    useState<boolean>(false)

  const effectiveFundingCycle = queuedFundingCycle?.number.gt(0)
    ? queuedFundingCycle
    : fundingCycle

  const effectivePayoutSplits = queuedFundingCycle?.number.gt(0)
    ? queuedPayoutSplits
    : payoutSplits

  const effectiveDistributionLimit = queuedDistributionLimit?.length
    ? queuedDistributionLimit
    : distributionLimit

  useLayoutEffect(() => {
    if (!visible || !effectiveFundingCycle || !effectivePayoutSplits) return

    dispatch(
      editingV2ProjectActions.setDistributionLimit(
        fromWad(effectiveDistributionLimit) ?? '',
      ),
    )

    // Set editing funding duration
    dispatch(
      editingV2ProjectActions.setDuration(
        fundingCycle?.duration.toString() ?? '',
      ),
    )

    // Set editing payouts
    dispatch(editingV2ProjectActions.setPayoutSplits(effectivePayoutSplits))
  }, [
    effectiveFundingCycle,
    effectivePayoutSplits,
    effectiveDistributionLimit,
    fundingCycle,
    visible,
    dispatch,
  ])

  // Load local reconfig modal redux state
  const { payoutGroupedSplits: editingPayoutGroupedSplits } = useAppSelector(
    state => state.editingV2Project,
  )
  const editingFundingCycleMetadata = useEditingV2FundingCycleMetadataSelector()
  const editingFundingCycleData = useEditingV2FundingCycleDataSelector()
  const editingFundAccessConstraints =
    useEditingV2FundAccessConstraintsSelector()

  const reconfigureV2FundingCycleTx = useReconfigureV2FundingCycleTx()

  const reconfigureFundingCycle = useCallback(async () => {
    setReconfigureTxLoading(true)
    if (
      !(
        editingFundingCycleData &&
        editingFundingCycleMetadata &&
        editingFundAccessConstraints
      )
    ) {
      throw new Error('Error deploying project.')
    }

    reconfigureV2FundingCycleTx(
      {
        fundingCycleData: editingFundingCycleData,
        fundingCycleMetadata: editingFundingCycleMetadata,
        fundAccessConstraints: editingFundAccessConstraints,
        groupedSplits: [editingPayoutGroupedSplits], // TODO: this will include reserveGroupedSplits when it's ready
      },
      {
        onDone() {
          console.info(
            'Reconfigure transaction executed. Awaiting confirmation...',
          )
        },
        onConfirmed() {
          setReconfigureTxLoading(false)
          onOk()
        },
      },
    )
  }, [
    editingFundAccessConstraints,
    editingFundingCycleMetadata,
    editingFundingCycleData,
    reconfigureV2FundingCycleTx,
    editingPayoutGroupedSplits,
    onOk,
  ])

  return (
    <Modal
      title={t`Reconfiguration`}
      visible={visible}
      onOk={reconfigureFundingCycle}
      onCancel={onOk}
      okText={t`Confirm funding changes`}
      okButtonProps={{ disabled: !fundingHasSavedChanges }}
      confirmLoading={reconfigureTxLoading}
      width={540}
      centered
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <h4 style={{ marginBottom: 0 }}>
          <Trans>Reconfigure project details</Trans>
        </h4>
        <ReconfigureButton
          title={t`Project details`}
          onClick={() => setProjectDetailsDrawerVisible(true)}
        />
        <h4 style={{ marginBottom: 0, marginTop: 20 }}>
          <Trans>Reconfigure funding details</Trans>
        </h4>
        <ReconfigureButton
          title={t`Funding target, duration and payouts`}
          onClick={() => setFundingDrawerVisible(true)}
        />
      </Space>
      <V2ReconfigureProjectDetailsDrawer
        visible={projectDetailsDrawerVisible}
        onFinish={() => setProjectDetailsDrawerVisible(false)}
      />
      <V2ReconfigureFundingDrawer
        visible={fundingDrawerVisible}
        onSave={() => {
          setFundingHasSavedChanges(true)
          setFundingDrawerVisible(false)
        }}
        onClose={() => {
          setFundingDrawerVisible(false)
        }}
      />
    </Modal>
  )
}
