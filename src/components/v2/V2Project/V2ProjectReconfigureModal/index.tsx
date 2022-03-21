import { t, Trans } from '@lingui/macro'
import { Modal, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CaretRightFilled } from '@ant-design/icons'

import store from 'redux/store'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { fromWad, parseWad } from 'utils/formatNumber'
import { useAppDispatch } from 'hooks/AppDispatch'

import { V2ReconfigureProjectDetailsDrawer } from './drawers/V2ReconfigureProjectDetailsDrawer'
import { V2ReconfigureFundingDrawer } from './drawers/V2ReconfigureFundingDrawer'
import { useAppSelector } from 'hooks/AppSelector'
import { getDefaultFundAccessConstraint } from 'utils/v2/fundingCycle'
import { SerializedV2FundAccessConstraint } from 'utils/v2/serializers'

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
    Updates you make to this section will only be applied to <i>upcoming</i>{' '}
    funding cycles.
  </p>
)

export default function V2ProjectReconfigureModal({
  visible,
  onOk,
}: {
  visible: boolean
  onOk: () => void
}) {
  const { colors } = useContext(ThemeContext).theme
  const {
    queuedFundingCycle,
    fundingCycle,
    payoutSplits,
    queuedPayoutSplits,
    distributionLimit,
    queuedDistributionLimit,
    projectMetadata,
  } = useContext(V2ProjectContext)

  const dispatch = useAppDispatch()

  const {
    fundAccessConstraints: editingFundAccessConstraints,
    fundingCycleData: editingFundingCycleData,
    payoutGroupedSplits: editingPayoutGroupedSplits,
  } = useAppSelector(state => state.editingV2Project)

  const [projectDetailsDrawerVisible, setProjectDetailsDrawerVisible] =
    useState<boolean>(false)
  const [fundingDrawerVisible, setFundingDrawerVisible] =
    useState<boolean>(false)
  const [tokenDrawerVisible, setTokenDrawerVisible] = useState<boolean>(false)
  const [rulesDrawerVisible, setRulesDrawerVisible] = useState<boolean>(false)

  const [fundingHasChanged, setFundingHasChanged] = useState<boolean>(false)

  const localStoreRef = useRef<typeof store>()

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

  // These 'useEffects' check if any funding value has changed in the redux state, and
  // enables the 'Confirm funding changes' button and tx if any changes have been made

  // Compare original V2ProjectContext distributionLimit and editingV2Project distributionLimit
  useEffect(() => {
    setFundingHasChanged(
      fromWad(effectiveDistributionLimit) !==
        getDefaultFundAccessConstraint(editingFundAccessConstraints)
          ?.distributionLimit,
    )
  }, [editingFundAccessConstraints, effectiveDistributionLimit])

  // Compare original V2ProjectContext duration and editingV2Project duration
  useEffect(() => {
    setFundingHasChanged(
      effectiveFundingCycle?.duration.toString() !==
        editingFundingCycleData?.duration,
    )
  }, [effectiveFundingCycle, editingFundingCycleData])

  // TODO: Compare original V2ProjectContext payoutSplits and editingV2Project payoutSplits

  return (
    <Modal
      title={t`Reconfiguration`}
      visible={visible}
      // confirmLoading={loading}
      onOk={() => {
        // If changes made to any funding tab, call another function internally to make that transaction
        if (fundingHasChanged) {
          console.log('TODO: Execute tx to change upcoming FC')
        }
        onOk()
      }}
      onCancel={onOk}
      okText={
        // If changes made to any funding tab, change this text to 'Confirm funding changes' or something
        fundingHasChanged ? t`Confirm funding changes` : t`OK`
      }
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
          title={t`Funding target/duration`}
          onClick={() => setFundingDrawerVisible(true)}
        />
        <ReconfigureButton
          title={t`Token`}
          onClick={() => setTokenDrawerVisible(true)}
        />
        <ReconfigureButton
          title={t`Rules`}
          onClick={() => setRulesDrawerVisible(true)}
        />
      </Space>
      <V2ReconfigureProjectDetailsDrawer
        visible={projectDetailsDrawerVisible}
        onFinish={() => setProjectDetailsDrawerVisible(false)}
      />
      <V2ReconfigureFundingDrawer
        visible={fundingDrawerVisible}
        onFinish={() => {
          setFundingDrawerVisible(false)
        }}
      />
    </Modal>
  )
}
