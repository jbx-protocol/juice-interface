import { t, Trans } from '@lingui/macro'
import { Col, Modal, Row, Space, Statistic } from 'antd'
import { Gutter } from 'antd/lib/grid/row'

import ProjectLogo from 'components/shared/ProjectLogo'

import { useAppSelector } from 'hooks/AppSelector'
import useMobile from 'hooks/Mobile'

import { orEmpty } from 'utils/orEmpty'

import { BigNumber } from 'ethers'

import { useContext } from 'react'
import { NetworkContext } from 'contexts/networkContext'

export default function ConfirmDeployV2ProjectModal({
  onOk,
  onCancel,
  visible,
  confirmLoading,
}: {
  terminalFee?: BigNumber
  onOk?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onCancel?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  visible?: boolean
  confirmLoading?: boolean
}) {
  const { signerNetwork, userAddress } = useContext(NetworkContext)
  const editingV2Project = useAppSelector(state => state.editingV2Project.info)

  const isMobile = useMobile()

  const rowGutter: [Gutter, Gutter] = [25, 20]

  return (
    <Modal
      visible={visible}
      onOk={onOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      okText={
        userAddress
          ? signerNetwork
            ? 'Deploy project on ' + signerNetwork
            : 'Deploy project'
          : 'Connect wallet to deploy'
      }
      width={800}
    >
      <Space size="large" direction="vertical">
        <h1 style={{ fontSize: '2rem' }}>
          <Trans>Review project</Trans>
        </h1>
        <div>
          <h2 style={{ marginBottom: 0 }}>
            <Trans>Project details</Trans>
          </h2>
          <p>
            <Trans>These attributes can be changed at any time.</Trans>
          </p>
          <Row gutter={rowGutter} style={{ marginBottom: 20 }}>
            <Col md={5} xs={24}>
              <Statistic title={t`Logo`} value={' '} />
              <div style={{ marginTop: -20 }}>
                <ProjectLogo
                  uri={editingV2Project?.metadata.logoUri}
                  name={editingV2Project?.metadata.name}
                  size={isMobile ? 50 : 80}
                />
              </div>
            </Col>
            <Col md={6} xs={24}>
              <Statistic
                title={t`Name`}
                value={orEmpty(editingV2Project?.metadata.name)}
              />
            </Col>
            <Col md={6} xs={24}>
              <Statistic
                title={t`Handle`}
                value={t`@` + orEmpty(editingV2Project?.handle)}
              />
            </Col>
            <Col md={7} xs={24}>
              <Statistic
                title={t`Pay button`}
                value={
                  editingV2Project?.metadata.payButton
                    ? editingV2Project?.metadata.payButton
                    : t`Pay`
                }
              />
            </Col>
          </Row>
          <Row gutter={rowGutter} style={{ wordBreak: 'break-all' }}>
            <Col md={5} xs={24}>
              <Statistic
                title={t`Twitter`}
                value={
                  editingV2Project?.metadata.twitter
                    ? '@' + editingV2Project.metadata.twitter
                    : orEmpty(undefined)
                }
              />
            </Col>
            <Col md={9} xs={24}>
              <Statistic
                title={t`Discord`}
                value={orEmpty(editingV2Project?.metadata.discord)}
              />
            </Col>
            <Col md={9} xs={24}>
              <Statistic
                title={t`Website`}
                value={orEmpty(editingV2Project?.metadata.infoUri)}
              />
            </Col>
          </Row>
          <br />
          <Row gutter={rowGutter}>
            <Col md={24} xs={24}>
              <Statistic
                title={t`Pay disclosure`}
                value={orEmpty(editingV2Project?.metadata.payDisclosure)}
              />
            </Col>
          </Row>
        </div>
      </Space>
    </Modal>
  )
}
