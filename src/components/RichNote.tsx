import { Space } from 'antd'
import Autolinker from 'autolinker'
import RichImgPreview from 'components/RichImgPreview'
import { useProcessedRichNote } from 'hooks/ProcessedRichNote'
import { twMerge } from 'tailwind-merge'

type RichNoteProps = {
  className?: string
  note: string | undefined
  ignoreMediaLinks?: boolean
  size?: string
}

export default function RichNote({
  className,
  note,
  ignoreMediaLinks,
  children,
}: React.PropsWithChildren<RichNoteProps>) {
  const { trimmedNote, formattedMediaLinks } = useProcessedRichNote(note)

  const noteToRender = ignoreMediaLinks ? note : trimmedNote

  if (noteToRender === undefined) return null

  return (
    <div className={twMerge('mt-1', className)}>
      {noteToRender.length ? (
        <span
          className="break-words pr-2"
          dangerouslySetInnerHTML={{
            __html: Autolinker.link(noteToRender, {
              sanitizeHtml: true,
              truncate: {
                length: 30,
                location: 'smart',
              },
            }).replaceAll('\n', '<br>'),
          }}
        ></span>
      ) : null}

      {children}

      {!ignoreMediaLinks && formattedMediaLinks?.length ? (
        <div className="block">
          <Space size="middle">
            {formattedMediaLinks.map((link, i) => (
              <RichImgPreview
                className="mt-2 h-auto max-h-24 w-auto p-2"
                key={i}
                src={link}
                size="large"
              />
            ))}
          </Space>
        </div>
      ) : null}
    </div>
  )
}
