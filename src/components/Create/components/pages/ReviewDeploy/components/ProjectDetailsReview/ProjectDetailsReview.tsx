import { t } from '@lingui/macro'
import FormattedAddress from 'components/FormattedAddress'
import ProjectLogo from 'components/ProjectLogo'
import { ProjectTagsRow } from 'components/ProjectTagsRow'
import { useAppSelector } from 'redux/hooks/AppSelector'
import { ReviewDescription } from '../ReviewDescription'

export const ProjectDetailsReview = () => {
  const {
    projectMetadata: {
      description,
      discord,
      telegram,
      logoUri,
      infoUri,
      name,
      payButton,
      payDisclosure,
      twitter,
      tags,
    },
    inputProjectOwner,
  } = useAppSelector(state => state.editingV2Project)

  return (
    <div className="flex flex-col gap-y-10 pt-5 pb-12 md:grid md:grid-cols-4">
      {/* START: Top */}
      <ReviewDescription
        title={t`Project name`}
        desc={
          <div className="overflow-hidden text-ellipsis text-base font-medium">
            {name}
          </div>
        }
      />
      <ReviewDescription
        className="col-span-3"
        title={t`Project description`}
        placeholder={t`No description`}
        desc={
          <div className="overflow-hidden text-ellipsis">{description}</div>
        }
      />
      {/* END: Top */}

      {/* START: Bottom */}
      <ReviewDescription
        className="row-span-2"
        title={t`Project logo`}
        desc={<ProjectLogo className="h-36 w-36" uri={logoUri} name={name} />}
      />
      <ReviewDescription
        title={t`Twitter`}
        desc={
          twitter ? (
            <div className="overflow-hidden text-ellipsis text-sm font-medium">
              {twitter}
            </div>
          ) : null
        }
      />
      <ReviewDescription
        title={t`Discord`}
        desc={
          discord ? (
            <div className="overflow-hidden text-ellipsis text-sm font-medium">
              {discord}
            </div>
          ) : null
        }
      />
      <ReviewDescription
        title={t`Telegram`}
        desc={
          telegram ? (
            <div className="overflow-hidden text-ellipsis text-sm font-medium">
              {telegram}
            </div>
          ) : null
        }
      />
      <ReviewDescription
        title={t`Website`}
        desc={
          infoUri ? (
            <div className="overflow-hidden text-ellipsis text-sm font-medium">
              {infoUri}
            </div>
          ) : null
        }
      />
      <ReviewDescription
        title={t`Tags`}
        desc={tags?.length ? <ProjectTagsRow tags={tags} /> : t`No tags`}
      />
      <ReviewDescription
        title={t`Pay button text`}
        desc={
          payButton ? (
            <div className="overflow-hidden text-ellipsis text-base font-medium">
              {payButton}
            </div>
          ) : null
        }
      />
      <ReviewDescription
        title={t`Payment notice`}
        desc={
          payDisclosure ? (
            <div className="overflow-hidden text-ellipsis text-base font-medium">
              {payDisclosure}
            </div>
          ) : null
        }
      />
      {/* END: Bottom */}
      <ReviewDescription
        title={t`Project owner`}
        desc={<FormattedAddress address={inputProjectOwner} />}
      />
    </div>
  )
}
