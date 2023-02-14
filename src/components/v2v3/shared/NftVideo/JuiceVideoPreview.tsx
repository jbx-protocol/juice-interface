import { IMAGE_OR_VIDEO_PREVIEW_CLASSES } from 'components/NftRewards/NftPreview'
import { useState } from 'react'
import { twJoin } from 'tailwind-merge'

export function JuiceVideoPreview({ src }: { src: string }) {
  const [loading, setLoading] = useState<boolean>(true)

  return (
    <>
      <video
        controls
        className={twJoin(
          IMAGE_OR_VIDEO_PREVIEW_CLASSES,
          loading ? 'h-[50vh] w-96' : '',
        )}
        autoPlay
        preload="none"
        onLoadedData={() => setLoading(false)}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
  )
}
