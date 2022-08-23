import { Space } from 'antd'
import Autolinker from 'autolinker'
import RichImgPreview from 'components/RichImgPreview'
import { useProcessedRichNote } from 'hooks/ProcessedRichNote'

type RichNoteProps = {
  note: string | undefined
  ignoreMediaLinks?: boolean
  style?: React.CSSProperties | undefined
}

export default function RichNote({
  note,
  style,
  ignoreMediaLinks,
  children,
}: React.PropsWithChildren<RichNoteProps>) {
  const { trimmedNote, formattedMediaLinks } = useProcessedRichNote(note)

  const noteToRender = ignoreMediaLinks ? note : trimmedNote

  if (noteToRender === undefined) return null

  return (
    <div style={{ marginTop: 5, ...style }}>
      {noteToRender.length ? (
        <span
          style={{
            overflowWrap: 'break-word',
            paddingRight: '0.5rem',
          }}
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
        <div style={{ display: 'block' }}>
          <Space size="middle">
            {formattedMediaLinks.map((link, i) => (
              <RichImgPreview
                key={i}
                src={link}
                style={{ marginTop: '0.5rem', padding: '0.5rem' }}
                maxHeight="6rem"
                height="auto"
                width="100%"
              />
            ))}
          </Space>
        </div>
      ) : null}
    </div>
  )
}
