import Autolinker from 'autolinker'
import RichImgPreview from 'components/RichImgPreview'
import { Space } from 'antd'
import { useProcessedRichNote } from 'hooks/ProcessedRichNote'

type RichNoteProps = {
  note: string | undefined
  style?: React.CSSProperties | undefined
}

export default function RichNote({
  note,
  style,
  children,
}: React.PropsWithChildren<RichNoteProps>) {
  const { trimmedNote, formattedMediaLinks } = useProcessedRichNote(note)

  if (trimmedNote === undefined) return null

  return (
    <div style={{ marginTop: 5, ...style }}>
      {trimmedNote.length ? (
        <span
          style={{
            overflowWrap: 'break-word',
            paddingRight: '0.5rem',
          }}
          dangerouslySetInnerHTML={{
            __html: Autolinker.link(trimmedNote, {
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

      {formattedMediaLinks?.length ? (
        <div style={{ display: 'block' }}>
          <Space size="middle" direction="vertical">
            {formattedMediaLinks.map((links, i) => (
              <Space key={i} size="middle">
                {links.map((link, i) => (
                  <RichImgPreview
                    key={i}
                    src={link}
                    style={{ marginTop: '0.5rem', padding: '0.5rem' }}
                    width="100%"
                    height="6rem"
                  />
                ))}
              </Space>
            ))}
          </Space>
        </div>
      ) : null}
    </div>
  )
}
