import { t } from '@lingui/macro'
import { Col, Row } from 'antd'
import ProjectLogo from 'components/ProjectLogo'
import { useAppSelector } from 'hooks/AppSelector'
import { cidFromUrl, ipfsCidUrl } from 'utils/ipfs'
import { DescriptionCol } from '../DescriptionCol'
import { emphasisedTextStyle, flexColumnStyle } from '../styles'

// END: CSS

export const ProjectDetailsReview = () => {
  const {
    description,
    discord,
    logoUri,
    infoUri,
    name,
    payButton,
    payDisclosure,
    twitter,
  } = useAppSelector(state => state.editingV2Project.projectMetadata)

  return (
    <div
      style={{
        ...flexColumnStyle,
        gap: '2.5rem',
        paddingTop: '1.25rem',
        paddingBottom: '3rem',
      }}
    >
      {/* Top */}
      <Row>
        <DescriptionCol
          span={6}
          title={t`Project name`}
          desc={<div style={emphasisedTextStyle()}>{name}</div>}
        />
        <DescriptionCol
          span={18}
          title={t`Project description`}
          optional={t`No description`}
          desc={description}
        />
        {/* TODO: Hide edit button for now */}
        {/* <Col offset={2} span={1}>
          <Button style={{ padding: 0 }} type="link">
            <EditOutlined />
          </Button>
        </Col> */}
      </Row>
      {/* Bottom */}
      <Row>
        <DescriptionCol
          span={6}
          title={t`Project logo`}
          desc={
            <ProjectLogo
              size={140}
              uri={
                cidFromUrl(logoUri)
                  ? ipfsCidUrl(cidFromUrl(logoUri)!)
                  : undefined
              }
              name={name}
            />
          }
        />
        <Col span={18}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
          >
            <Row>
              <DescriptionCol
                span={8}
                title={t`Twitter`}
                desc={
                  twitter ? (
                    <div style={emphasisedTextStyle('0.875rem')}>{twitter}</div>
                  ) : null
                }
              />
              <DescriptionCol
                span={8}
                title={t`Discord`}
                desc={
                  discord ? (
                    <div style={emphasisedTextStyle('0.875rem')}>{discord}</div>
                  ) : null
                }
              />
              <DescriptionCol
                span={8}
                title={t`Website`}
                desc={
                  infoUri ? (
                    <div style={emphasisedTextStyle('0.875rem')}>{infoUri}</div>
                  ) : null
                }
              />
            </Row>
            <Row>
              <Col span={8}>
                <DescriptionCol
                  flex={1}
                  title={t`Pay button text`}
                  desc={
                    payButton ? (
                      <div style={emphasisedTextStyle()}>Pay Now</div>
                    ) : null
                  }
                />
              </Col>
              <Col span={16}>
                <DescriptionCol
                  flex={1}
                  title={t`Pay disclaimer`}
                  desc={payDisclosure ? payDisclosure : null}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  )
}
