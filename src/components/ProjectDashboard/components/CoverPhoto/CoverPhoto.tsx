import { useCoverPhoto } from 'components/ProjectDashboard/hooks'
import { twMerge } from 'tailwind-merge'

export const CoverPhoto = () => {
  const { coverImageUrl, coverImageAltText } = useCoverPhoto()
  const hasCoverImage = !!coverImageUrl

  return (
    <div
      className={twMerge(
        'relative w-full',
        hasCoverImage ? 'h-70 bg-split-200 dark:bg-slate-600' : 'h-[168px]',
      )}
    >
      {coverImageUrl && (
        <img
          src={coverImageUrl}
          className={twMerge(
            'w-full object-cover',
            hasCoverImage ? 'h-70' : 'h-[168px]',
          )}
          crossOrigin="anonymous"
          alt={coverImageAltText}
        />
      )}
    </div>
  )
}
