import { twJoin } from 'tailwind-merge'
import { useState } from 'react'

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
      muted
      preload="auto"
      loop
      autoPlay
      className={twJoin(
        'max-h-[50vh] max-w-[458px] md:max-h-[60vh]',
        loading ? 'h-[50vh] w-96' : '',
        widthClass,
      )}
      onLoadedData={() => setLoading(false)}
    >
      <source src={src} />
      Your browser does not support the video tag.
    </video>
  )
}
