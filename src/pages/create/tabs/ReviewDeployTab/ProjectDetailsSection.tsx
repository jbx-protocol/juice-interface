import { t, Trans } from '@lingui/macro'
import { Col, Row, Space, Statistic } from 'antd'
import Callout from 'components/Callout'
import ProjectLogo from 'components/ProjectLogo'
import TooltipLabel from 'components/TooltipLabel'
import { useAppSelector } from 'hooks/AppSelector'
import useMobile from 'hooks/Mobile'
import { orEmpty } from 'utils/orEmpty'

import { rowGutter } from '.'

export default function ProjectDetailsSection() {
  const isMobile = useMobile()

  const { projectMetadata } = useAppSelector(state => state.editingV2Project)

  return (
    <Space direction="vertical" style={{ marginBottom: '2rem', width: '100%' }}>
      <h2 style={{ marginBottom: 0 }}>
        <Trans>Project details</Trans>
      </h2>
      <Callout>
        <Trans>Project details can be edited at any time.</Trans>
      </Callout>

      <Row gutter={rowGutter} style={{ marginBottom: 30 }}>
        <Col md={6} xs={12}>
          <Statistic title={t`Name`} value={orEmpty(projectMetadata.name)} />
        </Col>
        <Col md={6} xs={12}>
          <Statistic
            title={t`Pay button text`}
            value={
              projectMetadata.payButton ? projectMetadata.payButton : t`Pay`
            }
          />
        </Col>
        <Col md={6} xs={12}>
          <Statistic
            title={t`Twitter`}
            value={
              projectMetadata.twitter
                ? '@' + projectMetadata.twitter
                : orEmpty(undefined)
            }
          />
        </Col>
        <Col md={6} xs={12}>
          <Statistic
            title={t`Discord`}
            value={orEmpty(projectMetadata.discord)}
          />
        </Col>
      </Row>
      <Row gutter={rowGutter} style={{ wordBreak: 'break-all' }}>
        <Col md={6} xs={12}>
          <Statistic title={t`Logo`} value={' '} />
          <div style={{ marginTop: -20 }}>
            <ProjectLogo
              uri={projectMetadata.logoUri}
              name={projectMetadata.name}
              size={isMobile ? 50 : 80}
            />
          </div>
        </Col>
        <Col md={6} xs={12}>
          <Statistic
            title={t`Website`}
            value={orEmpty(projectMetadata.infoUri)}
          />
        </Col>
        <Col md={12} xs={24}>
          <Statistic
            title={
              <TooltipLabel
                label={t`Pay disclosure`}
                tip={t`Contributors will see this message before they pay your project.`}
              />
            }
            value={orEmpty(projectMetadata.payDisclosure)}
          />
        </Col>
      </Row>
    </Space>
  )
}
