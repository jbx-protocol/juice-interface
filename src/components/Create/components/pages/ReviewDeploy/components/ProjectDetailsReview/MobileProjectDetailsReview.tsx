import { t } from '@lingui/macro'
import ProjectLogo from 'components/ProjectLogo'
import { useAppSelector } from 'hooks/AppSelector'
import { cidFromUrl, openIpfsUrl } from 'utils/ipfs'

import { DescriptionCol } from '../DescriptionCol'

export const MobileProjectDetailsReview = () => {
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
    <>
      <DescriptionCol
        title={t`Project name`}
        desc={
          <div className="overflow-hidden text-ellipsis text-base font-medium">
            {name}
          </div>
        }
      />
      <DescriptionCol
        title={t`Project description`}
        placeholder={t`No description`}
        desc={
          <div className="overflow-hidden text-ellipsis">{description}</div>
        }
      />
      <DescriptionCol
        title={t`Project logo`}
        desc={
          <ProjectLogo
            className="h-36 w-36"
            uri={logoUri ? openIpfsUrl(cidFromUrl(logoUri)!) : undefined}
            name={name}
          />
        }
      />
      <DescriptionCol
        title={t`Twitter`}
        desc={
          twitter ? (
            <div className="overflow-hidden text-ellipsis text-sm font-medium">
              {twitter}
            </div>
          ) : null
        }
      />
      <DescriptionCol
        title={t`Discord`}
        desc={
          discord ? (
            <div className="overflow-hidden text-ellipsis text-sm font-medium">
              {discord}
            </div>
          ) : null
        }
      />
      <DescriptionCol
        title={t`Website`}
        desc={
          infoUri ? (
            <div className="overflow-hidden text-ellipsis text-sm font-medium">
              {infoUri}
            </div>
          ) : null
        }
      />
      <DescriptionCol
        title={t`Pay button text`}
        desc={
          payButton ? (
            <div className="overflow-hidden text-ellipsis text-base font-medium">
              {payButton}
            </div>
          ) : null
        }
      />
      <DescriptionCol
        title={t`Pay disclaimer`}
        desc={
          payDisclosure ? (
            <div className="overflow-hidden text-ellipsis text-base font-medium">
              {payDisclosure}
            </div>
          ) : null
        }
      />
    </>
  )
}
