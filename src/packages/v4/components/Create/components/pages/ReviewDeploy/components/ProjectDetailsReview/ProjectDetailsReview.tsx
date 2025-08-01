import { Trans, t } from '@lingui/macro'

import EthereumAddress from 'components/EthereumAddress'
import ProjectLogo from 'components/ProjectLogo'
import { ProjectTagsList } from 'components/ProjectTags/ProjectTagsList'
import { RichPreview } from 'components/RichPreview/RichPreview'
import { useWallet } from 'hooks/Wallet'
import { JBChainId } from 'juice-sdk-core'
import { useMemo } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { ipfsUriToGatewayUrl } from 'utils/ipfs'
import { wrapNonAnchorsInAnchor } from 'utils/wrapNonAnchorsInAnchor'
import { useChainId } from 'wagmi'
import { ReviewDescription } from '../ReviewDescription'

export const ProjectDetailsReview = () => {
  const { userAddress } = useWallet()
  const chainId = useChainId()
  const {
    projectMetadata: {
      description,
      discord,
      telegram,
      logoUri,
      coverImageUri,
      infoUri,
      name,
      payDisclosure,
      twitter,
      projectTagline,
      tags,
      introVideoUrl,
      introImageUri,
    },
    inputProjectOwner,
  } = useAppSelector(state => state.creatingV2Project)

  // const youtubeUrl = useMemo(() => {
  //   if (!introVideoUrl) return undefined
  //   const url = new URL(introVideoUrl)
  //   const videoId = url.searchParams.get('v')
  //   if (!videoId) return undefined
  //   return `https://www.youtube.com/embed/${videoId}`
  // }, [introVideoUrl])

  const ownerAddress = inputProjectOwner ?? userAddress

  const wrappedDescription = useMemo(() => {
    if (!description) return undefined
    return wrapNonAnchorsInAnchor(description)
  }, [description])

  const coverImageSrc = coverImageUri
    ? ipfsUriToGatewayUrl(coverImageUri)
    : undefined

  const introImageSrc = introImageUri
    ? ipfsUriToGatewayUrl(introImageUri)
    : undefined

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
        className="col-span-2"
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
        className="col-span-4"
        title={t`Payment notice`}
        desc={
          payDisclosure ? (
            <div className="overflow-hidden text-ellipsis text-base font-medium">
              {payDisclosure}
            </div>
          ) : null
        }
      />
      {coverImageSrc ? (
        <ReviewDescription
          className="row-span-2"
          title={t`Project cover photo`}
          desc={
            // eslint-disable-next-line @next/next/no-img-element
            <img width={144} src={coverImageSrc} alt={`${name} cover photo`} />
          }
        />
      ) : null}
      {/* END: Bottom */}
      <ReviewDescription
        title={t`Project owner`}
        desc={
          ownerAddress ? (
            <EthereumAddress
              address={ownerAddress}
              chainId={chainId as JBChainId}
            />
          ) : (
            <Trans>Wallet not connected</Trans>
          )
        }
      />
    </div>
  )
}
