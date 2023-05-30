import { useCoverPhoto } from 'components/ProjectDashboard/hooks'

export const CoverPhoto = () => {
  const { coverImageUrl, coverImageAltText } = useCoverPhoto()

  return (
    <div className="to-juice-30 relative h-70 w-full bg-gradient-to-br from-tangerine-400 to-juice-300">
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
