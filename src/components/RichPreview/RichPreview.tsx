import DOMPurify from 'dompurify'

export const RichPreview = ({ source }: { source: string }) => {
  const purified = DOMPurify.sanitize(source)

  return (
    <div
      id="rich-text"
      dangerouslySetInnerHTML={{
        __html: purified,
      }}
    />
  )
}
