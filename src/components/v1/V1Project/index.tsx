import { Col, Row } from 'antd'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { CSSProperties, useContext, useState } from 'react'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'
import { useForm } from 'antd/lib/form/Form'
import V1AmountToWei from 'utils/v1/V1AmountToWei'

import ProjectHeader from 'components/shared/ProjectHeader'
import PayInput, { PayFormFields } from 'components/shared/inputs/PayInput'

import BalanceTimeline from './BalanceTimeline'
import FundingCycles from './FundingCycles'
import Paid from './Paid'
import ProjectActivity from './ProjectActivity'
import V1ProjectHeaderActions from './V1ProjectHeaderActions'
import Rewards from './Rewards'
import V1PayButton from './Pay/V1PayButton'
import V1PayInputSubText from './Pay/V1PayInputSubText'
import PayWarningModal from './modals/PayWarningModal'
import ConfirmPayOwnerModal from './modals/ConfirmPayOwnerModal'

export default function V1Project({
  style,
  showCurrentDetail,
  column,
}: {
  style?: CSSProperties
  showCurrentDetail?: boolean
  column?: boolean
}) {
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)
  const [payWarningModalVisible, setPayWarningModalVisible] =
    useState<boolean>(false)

  const [payForm] = useForm<PayFormFields>()
  const payAmount: string = payForm.getFieldValue('amount')
  const payInCurrency = payForm.getFieldValue('payInCurrency')

  const { currentFC, projectId, handle, metadata, isArchived } =
    useContext(V1ProjectContext)

  const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)

  const gutter = 40

  if (!projectId || !fcMetadata) return null

  return (
    <div style={style}>
      <ProjectHeader
        metadata={metadata}
        handle={handle}
        isArchived={isArchived}
        actions={<V1ProjectHeaderActions />}
      />

      <Row gutter={gutter} align="bottom">
        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <Paid />
        </Col>

        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <PayInput
            form={payForm}
            payButton={
              <V1PayButton
                onClick={() => setPayWarningModalVisible(true)}
                form={payForm}
              />
            }
            inputSubText={
              <V1PayInputSubText
                payInCurrency={payInCurrency}
                amount={payAmount}
              />
            }
          />
        </Col>
      </Row>

      <Row gutter={gutter} style={{ paddingBottom: gutter }}>
        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          {projectId.gt(0) && (
            <div style={{ marginBottom: gutter }}>
              <BalanceTimeline height={240} />
            </div>
          )}

          <div style={{ marginBottom: gutter }}>
            <Rewards />
          </div>

          <FundingCycles showCurrentDetail={showCurrentDetail} />
        </Col>

        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <ProjectActivity />
        </Col>
      </Row>
      <PayWarningModal
        visible={payWarningModalVisible}
        onOk={() => {
          setPayWarningModalVisible(false)
          setPayModalVisible(true)
        }}
        onCancel={() => setPayWarningModalVisible(false)}
      />
      <ConfirmPayOwnerModal
        visible={payModalVisible}
        onSuccess={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        weiAmount={V1AmountToWei(payForm.getFieldValue('amount'))}
      />
    </div>
  )
}
