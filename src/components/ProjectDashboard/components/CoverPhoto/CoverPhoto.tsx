import { useCoverPhoto } from 'components/ProjectDashboard/hooks'

export const CoverPhoto = () => {
  const { coverImageUrl, coverImageAltText } = useCoverPhoto()

  return (
    <div className="relative h-70 w-full bg-split-200 dark:bg-slate-600">
      {coverImageUrl && (
        <img
          src={coverImageUrl}
          className="h-70 w-full object-cover"
          crossOrigin="anonymous"
          alt={coverImageAltText}
        />
      )}
    </div>
  )
}
