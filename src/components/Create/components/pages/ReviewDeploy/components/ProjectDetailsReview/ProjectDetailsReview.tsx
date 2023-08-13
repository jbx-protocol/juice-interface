import { t } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import ProjectLogo from 'components/ProjectLogo'
import { ProjectTagsList } from 'components/ProjectTags/ProjectTagsList'
import { RichPreview } from 'components/RichPreview'
import { useMemo } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { wrapNonAnchorsInAnchor } from 'utils/wrapNonAnchorsInAnchor'
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
      projectTagline,
      tags,
    },
    inputProjectOwner,
  } = useAppSelector(state => state.editingV2Project)

  const wrappedDescription = useMemo(() => {
    if (!description) return undefined
    return wrapNonAnchorsInAnchor(description)
  }, [description])

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
        title={t`Tagline`}
        desc={
          projectTagline ? (
            <div className="overflow-hidden text-ellipsis text-base font-medium">
              {projectTagline}
            </div>
          ) : null
        }
      />
      <ReviewDescription
        className="col-span-4 whitespace-pre-wrap"
        title={t`Project description`}
        placeholder={t`No description`}
        desc={<RichPreview source={wrappedDescription ?? ''} />}
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
        desc={tags?.length ? <ProjectTagsList tags={tags} /> : t`No tags`}
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
        desc={<EthereumAddress address={inputProjectOwner} />}
      />
    </div>
  )
}
