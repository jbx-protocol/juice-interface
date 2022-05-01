import { t, Trans } from '@lingui/macro'
import { Col, Row, Statistic } from 'antd'
import ProjectLogo from 'components/shared/ProjectLogo'
import TooltipLabel from 'components/shared/TooltipLabel'
import { useAppSelector } from 'hooks/AppSelector'
import useMobile from 'hooks/Mobile'
import { orEmpty } from 'utils/orEmpty'

import { rowGutter } from '.'

export default function ProjectDetailsSection() {
  const isMobile = useMobile()

  const { projectMetadata } = useAppSelector(state => state.editingV2Project)

  return (
    <div>
      <h2 style={{ marginBottom: 0 }}>
        <Trans>Project details</Trans>
      </h2>
      <p>
        <Trans>These attributes can be changed at any time.</Trans>
      </p>
      <Row gutter={rowGutter} style={{ marginBottom: 30 }}>
        <Col md={6} xs={24}>
          <Statistic title={t`Name`} value={orEmpty(projectMetadata.name)} />
        </Col>
        <Col md={6} xs={24}>
          <Statistic
            title={t`Pay button text`}
            value={
              projectMetadata.payButton ? projectMetadata.payButton : t`Pay`
            }
          />
        </Col>
        <Col md={6} xs={24}>
          <Statistic
            title={t`Twitter`}
            value={
              projectMetadata.twitter
                ? '@' + projectMetadata.twitter
                : orEmpty(undefined)
            }
          />
        </Col>
        <Col md={6} xs={24}>
          <Statistic
            title={t`Discord`}
            value={orEmpty(projectMetadata.discord)}
          />
        </Col>
      </Row>
      <Row gutter={rowGutter} style={{ wordBreak: 'break-all' }}>
        <Col md={6} xs={24}>
          <Statistic title={t`Logo`} value={' '} />
          <div style={{ marginTop: -20 }}>
            <ProjectLogo
              uri={projectMetadata.logoUri}
              name={projectMetadata.name}
              size={isMobile ? 50 : 80}
            />
          </div>
        </Col>
        <Col md={6} xs={24}>
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
    </div>
  )
}
