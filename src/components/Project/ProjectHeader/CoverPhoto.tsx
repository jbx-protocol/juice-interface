// import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import Image from "next/image"
import { useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useCoverPhoto } from './hooks/useCoverPhoto'

export const CoverPhoto = () => {
  const { coverImageUrl, coverImageAltText } = useCoverPhoto()
  // const { projectId } = useProjectMetadataContext()
  // A cover whose IPFS content no longer resolves renders as a broken image
  // in a tall empty band; treat it as no cover once it fails to load.
  const [failedUrl, setFailedUrl] = useState<string>()
  const hasCoverImage = !!coverImageUrl && coverImageUrl !== failedUrl

  const applyDarkerCoverPhoto = useMemo(() => {
    // This is used for countdown projects only; Since it is disabled, we don't need to apply darker cover photo for now
    return false
    // return projectId === RS_PROJECT_ID
  }, [])

  return (
    <div
      className={twMerge(
        'relative w-full',
        hasCoverImage ? 'h-70 bg-split-200 dark:bg-slate-600' : 'h-[168px]',
      )}
    >
      {hasCoverImage && (
        <>
          <Image
            fill
            src={coverImageUrl}
            className={twMerge(
              'w-full object-cover',
              hasCoverImage ? 'h-70' : 'h-[168px]',
            )}
            crossOrigin="anonymous"
            alt={coverImageAltText}
            onError={() => setFailedUrl(coverImageUrl)}
          />
          {applyDarkerCoverPhoto && (
            <div className="absolute h-70 w-full bg-black opacity-30 drop-shadow" />
          )}
        </>
      )}
    </div>
  )
}
