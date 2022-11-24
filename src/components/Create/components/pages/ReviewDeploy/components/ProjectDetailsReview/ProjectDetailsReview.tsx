import { t } from '@lingui/macro'
import { Col, Row } from 'antd'
import ProjectLogo from 'components/ProjectLogo'
import { useAppSelector } from 'hooks/AppSelector'
import useMobile from 'hooks/Mobile'
import { cidFromUrl, restrictedIpfsUrl } from 'utils/ipfs'
import { DescriptionCol } from '../DescriptionCol'
import { MobileProjectDetailsReview } from './MobileProjectDetailsReview'

// END: CSS

export const ProjectDetailsReview = () => {
  const isMobile = useMobile()
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
    <div className="flex flex-col gap-10 pt-5 pb-12">
      {/* TODO: This is a bit of a hack - im sure there is a more elegant solution */}
      {isMobile ? (
        <MobileProjectDetailsReview />
      ) : (
        <>
          {/* Top */}
          <Row>
            <DescriptionCol
              span={6}
              title={t`Project name`}
              desc={<div className="text-base font-medium">{name}</div>}
            />
            <DescriptionCol
              span={18}
              title={t`Project description`}
              placeholder={t`No description`}
              desc={description}
            />
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
                    logoUri
                      ? restrictedIpfsUrl(cidFromUrl(logoUri)!)
                      : undefined
                  }
                  name={name}
                />
              }
            />
            <Col span={18}>
              <div className="flex flex-col gap-10">
                <Row>
                  <DescriptionCol
                    span={8}
                    title={t`Twitter`}
                    desc={
                      twitter ? (
                        <div className="text-sm font-medium">{twitter}</div>
                      ) : null
                    }
                  />
                  <DescriptionCol
                    span={8}
                    title={t`Discord`}
                    desc={
                      discord ? (
                        <div className="text-sm font-medium">{discord}</div>
                      ) : null
                    }
                  />
                  <DescriptionCol
                    span={8}
                    title={t`Website`}
                    desc={
                      infoUri ? (
                        <div className="text-sm font-medium">{infoUri}</div>
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
                          <div className="text-base font-medium">
                            {payButton}
                          </div>
                        ) : null
                      }
                    />
                  </Col>
                  <Col span={16}>
                    <DescriptionCol
                      flex={1}
                      title={t`Pay disclaimer`}
                      desc={
                        payDisclosure ? (
                          <div className="text-base font-medium">
                            {payDisclosure}
                          </div>
                        ) : null
                      }
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}
