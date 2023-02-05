export function JuiceVideoPreview({ src }: { src: string }) {
  return (
    <>
      <video width="320" height="240" controls>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
  )
}
