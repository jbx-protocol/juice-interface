import { Space } from 'antd'
import Autolinker from 'autolinker'
import { JuiceVideoThumbnailOrImage } from 'components/NftVideo/JuiceVideoThumbnailOrImage'
import { twMerge } from 'tailwind-merge'
import { useProcessedRichNote } from './hooks'

type RichNoteProps = {
  className?: string
  note: string | undefined
  ignoreMediaLinks?: boolean
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
              <JuiceVideoThumbnailOrImage
                key={i}
                className={twMerge(
                  'h-24 w-24 cursor-pointer hover:brightness-50',
                  className,
                )}
                src={link}
                showPreviewOnClick
              />
            ))}
          </Space>
        </div>
      ) : null}
    </div>
  )
}
