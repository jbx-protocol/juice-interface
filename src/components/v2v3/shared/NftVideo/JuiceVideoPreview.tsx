import { IMAGE_OR_VIDEO_PREVIEW_CLASSES } from 'components/NftRewards/NftPreview'

export function JuiceVideoPreview({ src }: { src: string }) {
  return (
    <>
      <video controls className={IMAGE_OR_VIDEO_PREVIEW_CLASSES}>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
  )
}
