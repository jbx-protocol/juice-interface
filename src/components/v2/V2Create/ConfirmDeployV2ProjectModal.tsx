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
  const projectMetadata = useAppSelector(
    state => state.editingV2Project.projectMetadata,
  )

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
                  uri={projectMetadata?.logoUri}
                  name={projectMetadata?.name}
                  size={isMobile ? 50 : 80}
                />
              </div>
            </Col>
            <Col md={6} xs={24}>
              <Statistic
                title={t`Name`}
                value={orEmpty(projectMetadata?.name)}
              />
            </Col>
            <Col md={7} xs={24}>
              <Statistic
                title={t`Pay button`}
                value={
                  projectMetadata?.payButton
                    ? projectMetadata?.payButton
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
                  projectMetadata?.twitter
                    ? '@' + projectMetadata?.twitter
                    : orEmpty(undefined)
                }
              />
            </Col>
            <Col md={9} xs={24}>
              <Statistic
                title={t`Discord`}
                value={orEmpty(projectMetadata?.discord)}
              />
            </Col>
            <Col md={9} xs={24}>
              <Statistic
                title={t`Website`}
                value={orEmpty(projectMetadata?.infoUri)}
              />
            </Col>
          </Row>
          <br />
          <Row gutter={rowGutter}>
            <Col md={24} xs={24}>
              <Statistic
                title={t`Pay disclosure`}
                value={orEmpty(projectMetadata?.payDisclosure)}
              />
            </Col>
          </Row>
        </div>
      </Space>
    </Modal>
  )
}
