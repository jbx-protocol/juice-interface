import { t } from '@lingui/macro'
import FormattedAddress from 'components/FormattedAddress'
import ProjectLogo from 'components/ProjectLogo'
import { useAppSelector } from 'redux/hooks/AppSelector'
import { DescriptionCol } from '../DescriptionCol'

export const MobileProjectDetailsReview = () => {
  const {
    projectMetadata: {
      description,
      discord,
      logoUri,
      infoUri,
      name,
      payButton,
      payDisclosure,
      twitter,
    },
    inputProjectOwner,
  } = useAppSelector(state => state.editingV2Project)
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
        desc={<ProjectLogo className="h-36 w-36" uri={logoUri} name={name} />}
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
      {inputProjectOwner && (
        <DescriptionCol
          title={t`Project owner`}
          desc={<FormattedAddress address={inputProjectOwner} />}
        />
      )}
    </>
  )
}
