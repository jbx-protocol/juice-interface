import { useCoverPhoto } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useCoverPhoto'
import Image from 'next/image'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { useProjectMetadata } from '../../hooks/useProjectMetadata'

const RS_PROJECT_ID = 618

export const CoverPhoto = () => {
  const { coverImageUrl, coverImageAltText } = useCoverPhoto()
  const { projectId } = useProjectMetadata()
  const hasCoverImage = !!coverImageUrl

  const applyDarkerCoverPhoto = useMemo(() => {
    return projectId === RS_PROJECT_ID
  }, [projectId])

  return (
    <div
      className={twMerge(
        'relative w-full',
        hasCoverImage ? 'h-70 bg-split-200 dark:bg-slate-600' : 'h-[168px]',
      )}
    >
      {coverImageUrl && (
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
          />
          {applyDarkerCoverPhoto && (
            <div className="absolute h-70 w-full bg-black opacity-30" />
          )}
        </>
      )}
    </div>
  )
}
