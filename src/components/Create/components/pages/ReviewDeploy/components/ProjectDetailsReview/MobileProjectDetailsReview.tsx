import { t } from '@lingui/macro'
import ProjectLogo from 'components/ProjectLogo'
import { useAppSelector } from 'hooks/AppSelector'
import { cidFromUrl, restrictedIpfsUrl } from 'utils/ipfs'
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
        desc={<div className="font-medium text-base">{name}</div>}
      />
      <DescriptionCol
        title={t`Project description`}
        placeholder={t`No description`}
        desc={description}
      />
      <DescriptionCol
        title={t`Project logo`}
        desc={
          <ProjectLogo
            size={140}
            uri={logoUri ? restrictedIpfsUrl(cidFromUrl(logoUri)!) : undefined}
            name={name}
          />
        }
      />
      <DescriptionCol
        title={t`Twitter`}
        desc={
          twitter ? <div className="font-medium text-sm">{twitter}</div> : null
        }
      />
      <DescriptionCol
        title={t`Discord`}
        desc={
          discord ? <div className="font-medium text-sm">{discord}</div> : null
        }
      />
      <DescriptionCol
        title={t`Website`}
        desc={
          infoUri ? <div className="font-medium text-sm">{infoUri}</div> : null
        }
      />
      <DescriptionCol
        title={t`Pay button text`}
        desc={
          payButton ? (
            <div className="font-medium text-base">{payButton}</div>
          ) : null
        }
      />
      <DescriptionCol
        title={t`Pay disclaimer`}
        desc={
          payDisclosure ? (
            <div className="font-medium text-base">{payDisclosure}</div>
          ) : null
        }
      />
    </>
  )
}
