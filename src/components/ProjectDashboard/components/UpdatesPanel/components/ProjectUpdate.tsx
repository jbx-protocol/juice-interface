import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import { JuiceVideoThumbnailOrImage } from 'components/JuiceVideo/JuiceVideoThumbnailOrImage'
import { useMemo } from 'react'
import { ProjectUpdate as ProjectUpdateEntity } from '../hooks/useUpdatesPanel'
import { formatDateString } from '../utils/formatDateString'

export const ProjectUpdate = ({
  title,
  createdAt,
  imageUrl,
  message,
  posterWallet,
}: ProjectUpdateEntity) => {
  const subtitle = useMemo(() => {
    const dateString = formatDateString(createdAt)
    return (
      <Trans>
        Posted {dateString} by <EthereumAddress address={posterWallet} />
      </Trans>
    )
  }, [createdAt, posterWallet])
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border border-grey-200 py-6 px-5 shadow-md dark:border-slate-600">
      <div className="flex justify-between">
        <div className="font-heading text-xl font-medium">{title}</div>
        <EllipsisVerticalIcon className="h-6 w-6" role="button" />
      </div>
      <span className="text-xs text-grey-500 dark:text-slate-200">
        {subtitle}
      </span>
      <div>
        {message.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {imageUrl && (
        <JuiceVideoThumbnailOrImage
          className="max-h-[288px]"
          src={imageUrl}
          alt={title}
        />
      )}
    </div>
  )
}

export const ProjectUpdateSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border border-grey-200 py-6 px-5 shadow-md dark:border-slate-600">
      <div className="flex justify-between">
        <div className="flex h-5 w-[80%] animate-pulse rounded-md bg-grey-200" />
      </div>
      <span className="h-4 w-[40%] animate-pulse rounded-md bg-grey-200" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-full animate-pulse rounded-md bg-grey-200" />
        <div className="h-4 w-[80%] animate-pulse rounded-md bg-grey-200" />
        <div className="h-4 w-[72%] animate-pulse rounded-md bg-grey-200" />
        <div className="h-4 w-full animate-pulse rounded-md bg-grey-200" />
      </div>
    </div>
  )
}
