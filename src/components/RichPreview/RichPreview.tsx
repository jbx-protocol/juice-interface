import DOMPurify from 'dompurify'

export const RichPreview = ({ source }: { source: string }) => {
  const purified = DOMPurify.sanitize(source)

  return (
    <div
      id="rich-text"
      className="break-words"
      dangerouslySetInnerHTML={{
        __html: purified,
      }}
    />
  )
}
