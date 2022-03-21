import { t, Trans } from '@lingui/macro'
import { Modal, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'
import { CaretRightFilled } from '@ant-design/icons'

import { V2ReconfigureProjectDetailsDrawer } from './drawers/V2ReconfigureProjectDetailsDrawer'

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
  const [projectDetailsDrawerVisible, setProjectDetailsDrawerVisible] =
    useState<boolean>(false)
  const [, setFundingDrawerVisible] = useState<boolean>(false)
  const [, setTokenDrawerVisible] = useState<boolean>(false)
  const [, setRulesDrawerVisible] = useState<boolean>(false)

  const [fundingChanged] = useState<boolean>(false)

  return (
    <Modal
      title={t`Reconfiguration`}
      visible={visible}
      onOk={onOk}
      onCancel={onOk}
      okText={
        // If changes made to any funding tab, change this text to 'Confirm funding changes' or something
        fundingChanged ? t`Confirm funding changes` : t`OK`
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
    </Modal>
  )
}
