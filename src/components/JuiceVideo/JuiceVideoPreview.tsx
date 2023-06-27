import { useState } from 'react'
import { twJoin } from 'tailwind-merge'

export function JuiceVideoPreview({
  src,
  widthClass,
}: {
  src: string
  widthClass?: string
}) {
  const [loading, setLoading] = useState<boolean>(true)

  return (
    <video
      controls
      className={twJoin(
        'max-h-[50vh] max-w-[458px] md:max-h-[60vh]',
        loading ? 'h-[50vh] w-96' : '',
        widthClass,
      )}
      autoPlay
      preload="none"
      onLoadedData={() => setLoading(false)}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}
