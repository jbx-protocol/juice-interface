import { t } from '@lingui/macro'
import ProjectLogo from 'components/ProjectLogo'
import { useAppSelector } from 'hooks/AppSelector'
import { cidFromUrl, restrictedIpfsUrl } from 'utils/ipfs'
import { DescriptionCol } from '../DescriptionCol'
import { emphasisedTextStyle } from '../styles'

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
        desc={<div style={emphasisedTextStyle()}>{name}</div>}
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
          twitter ? (
            <div style={emphasisedTextStyle('0.875rem')}>{twitter}</div>
          ) : null
        }
      />
      <DescriptionCol
        title={t`Discord`}
        desc={
          discord ? (
            <div style={emphasisedTextStyle('0.875rem')}>{discord}</div>
          ) : null
        }
      />
      <DescriptionCol
        title={t`Website`}
        desc={
          infoUri ? (
            <div style={emphasisedTextStyle('0.875rem')}>{infoUri}</div>
          ) : null
        }
      />
      <DescriptionCol
        title={t`Pay button text`}
        desc={
          payButton ? (
            <div style={emphasisedTextStyle()}>{payButton}</div>
          ) : null
        }
      />
      <DescriptionCol
        title={t`Pay disclaimer`}
        desc={payDisclosure ? payDisclosure : null}
      />
    </>
  )
}
