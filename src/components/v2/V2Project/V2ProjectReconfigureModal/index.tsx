import { t, Trans } from '@lingui/macro'
import { Modal, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useLayoutEffect, useRef, useState } from 'react'
import { CaretRightFilled } from '@ant-design/icons'

import { V2ReconfigureProjectDetailsDrawer } from './drawers/V2ReconfigureProjectDetailsDrawer'
import { V2ReconfigureFundingDrawer } from './drawers/V2ReconfigureFundingDrawer'
import { Provider } from 'react-redux'
import store from 'redux/store'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import {
  SerializedV2FundAccessConstraint,
  serializeFundAccessConstraint,
  serializeV2FundingCycleData,
} from 'utils/v2/serializers'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

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

  const [projectDetailsDrawerVisible, setProjectDetailsDrawerVisible] =
    useState<boolean>(false)
  const [fundingDrawerVisible, setFundingDrawerVisible] =
    useState<boolean>(false)
  const [tokenDrawerVisible, setTokenDrawerVisible] = useState<boolean>(false)
  const [rulesDrawerVisible, setRulesDrawerVisible] = useState<boolean>(false)

  const [fundingChanged, setFundingChanged] = useState<boolean>(false)

  const localStoreRef = useRef<typeof store>()

  useLayoutEffect(() => {
    const effectiveFundingCycle = queuedFundingCycle?.number.gt(0)
      ? queuedFundingCycle
      : fundingCycle
    const effectivePayoutSplits = queuedFundingCycle?.number.gt(0)
      ? queuedPayoutSplits
      : payoutSplits

    if (!visible || !effectiveFundingCycle || !effectivePayoutSplits) return

    // set editing funding target
    const effectiveDistributionLimit = queuedDistributionLimit?.length
      ? queuedDistributionLimit
      : distributionLimit

    editingV2ProjectActions.setDistributionLimit(
      effectiveDistributionLimit ?? '',
    )
    console.log('distributionLimit: ', distributionLimit)
    console.log('effectiveDistributionLimit: ', effectiveDistributionLimit)

    // TODO: set editing funding duration

    // TODO: set editing payouts

    // dispatch(
    //   editingV2ProjectActions.setFundAccessConstraints(
    //     serializeFundAccessConstraint({
    //       ...effectiveFundingCycle,
    //       ...metadata,
    //       reserved: BigNumber.from(metadata.reservedRate),
    //       bondingCurveRate: BigNumber.from(metadata.bondingCurveRate),
    //     }),
    //   ),
    // )
    // setEditingTicketMods(ticketMods)
    // setEditingPayoutMods(payoutMods)
    // ticketingForm.setFieldsValue({
    //   reserved: parseFloat(perbicentToPercent(metadata.reservedRate)),
    // })
    // incentivesForm.setFieldsValue({
    //   discountRate: permilleToPercent(fundingCycle.discountRate),
    //   bondingCurveRate: perbicentToPercent(metadata.bondingCurveRate),
    // })

    // if (metadata.version === 1) {
    //   restrictedActionsForm.setFieldsValue({
    //     payIsPaused: metadata.payIsPaused,
    //     ticketPrintingIsAllowed: metadata.ticketPrintingIsAllowed,
    //   })
    // }
  }, [
    queuedFundingCycle,
    fundingCycle,
    queuedDistributionLimit,
    distributionLimit,
    payoutSplits,
    queuedPayoutSplits,
    visible,
  ])

  return (
    <Modal
      title={t`Reconfiguration`}
      visible={visible}
      // confirmLoading={loading}
      onOk={() => {
        // If changes made to any funding tab, call another function internally to make that transaction
        onOk()
      }}
      onCancel={onOk}
      okText={
        // If changes made to any funding tab, change this text to 'Confirm funding changes' or something
        fundingChanged ? t`Confirm funding changes` : t`OK`
      }
      // okButtonProps={{
      //   disabled: !redeemAmount || parseInt(redeemAmount) === 0,
      // }}
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
        onFinish={() => setFundingDrawerVisible(false)}
      />
    </Modal>
  )
}
