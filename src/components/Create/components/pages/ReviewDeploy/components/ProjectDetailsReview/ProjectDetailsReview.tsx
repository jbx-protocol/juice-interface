import { Trans, t } from '@lingui/macro'
import { Callout } from 'components/Callout/Callout'
import EthereumAddress from 'components/EthereumAddress'
import ProjectLogo from 'components/ProjectLogo'
import { ProjectTagsList } from 'components/ProjectTags/ProjectTagsList'
import { RichPreview } from 'components/RichPreview/RichPreview'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { useWallet } from 'hooks/Wallet'
import { useMemo } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { featureFlagEnabled } from 'utils/featureFlags'
import { parseWad } from 'utils/format/formatNumber'
import { ipfsUriToGatewayUrl } from 'utils/ipfs'
import { wrapNonAnchorsInAnchor } from 'utils/wrapNonAnchorsInAnchor'
import { ReviewDescription } from '../ReviewDescription'

export const ProjectDetailsReview = () => {
  const { userAddress } = useWallet()
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
      softTargetAmount,
      softTargetCurrency,
    },
    inputProjectOwner,
  } = useAppSelector(state => state.editingV2Project)

  const youtubeUrl = useMemo(() => {
    if (!introVideoUrl) return undefined
    const url = new URL(introVideoUrl)
    const videoId = url.searchParams.get('v')
    if (!videoId) return undefined
    return `https://www.youtube.com/embed/${videoId}`
  }, [introVideoUrl])

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
            <img width={144} src={coverImageSrc} alt={`${name} cover photo`} />
          }
        />
      ) : null}
      {/* END: Bottom */}
      <ReviewDescription
        title={t`Project owner`}
        desc={
          ownerAddress ? (
            <EthereumAddress address={ownerAddress} />
          ) : (
            <Trans>Wallet not connected</Trans>
          )
        }
      />

      {featureFlagEnabled(FEATURE_FLAGS.JUICE_CROWD_METADATA_CONFIGURATION) && (
        <>
          {introVideoUrl && introImageUri ? (
            <Callout.Warning className="col-span-4">
              Intro video and image are both set. Only the video will be seen on
              the juicecrowd project
            </Callout.Warning>
          ) : null}
          <ReviewDescription
            className="col-span-4"
            title={t`Juicecrowd intro video`}
            desc={
              youtubeUrl ? (
                <div className="relative w-full overflow-hidden rounded-lg pt-[56.25%]">
                  <iframe
                    className="absolute top-0 left-0 h-full w-full"
                    src={youtubeUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Embedded youtube"
                  />
                </div>
              ) : null
            }
          />
          <ReviewDescription
            title={t`Juicecrowd intro image`}
            desc={
              introImageSrc ? (
                <img
                  width={144}
                  src={introImageSrc}
                  alt={`${name} intro image`}
                />
              ) : null
            }
          />
          <ReviewDescription
            title={t`Juicecrowd soft target`}
            desc={
              softTargetAmount ? (
                <AmountInCurrency
                  amount={parseWad(softTargetAmount)}
                  currency={softTargetCurrency === '1' ? 'ETH' : 'USD'}
                />
              ) : null
            }
          />
        </>
      )}
    </div>
  )
}
