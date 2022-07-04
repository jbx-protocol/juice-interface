import Autolinker from 'autolinker'
import RichImgPreview from 'components/RichImgPreview'
import { ThemeContext } from 'contexts/themeContext'
import { useContentType } from 'hooks/ContentType'
import { useContext, useMemo } from 'react'

type RichNoteProps = {
  note: string | undefined
  style?: React.CSSProperties | undefined
}

export default function RichNote({
  note,
  style,
  children,
}: React.PropsWithChildren<RichNoteProps>) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const mediaLink = useMemo(() => {
    if (!note) return ''

    const https = 'https://'
    const http = 'http://'

    if (note.includes(https)) {
      return https + note.split(https)[1].split(' ')[0]
    } else if (note.includes(http)) {
      return http + note.split(http)[1].split(' ')[0]
    }
    return ''
  }, [note])

  const contentType = useContentType(mediaLink)

  if (!note) return null

  const sanitizedNote =
    mediaLink &&
    (contentType === 'image/jpeg' ||
      contentType === 'image/jpg' ||
      contentType === 'image/gif' ||
      contentType === 'image/png' ||
      contentType === 'image/svg')
      ? note.replace(mediaLink, '')
      : note

  return (
    <div style={{ marginTop: 5, ...style }}>
      <span
        style={{
          color: colors.text.secondary,
          overflowWrap: 'break-word',
          paddingRight: '0.5rem',
        }}
        dangerouslySetInnerHTML={{
          __html: Autolinker.link(sanitizedNote, {
            sanitizeHtml: true,
            truncate: {
              length: 30,
              location: 'smart',
            },
          }).replaceAll('\n', '<br>'),
        }}
      ></span>

      {children}

      {mediaLink && (
        <div>
          <RichImgPreview
            src={mediaLink}
            style={{ marginTop: 10 }}
            width="100%"
            height={140}
          />
        </div>
      )}
    </div>
  )
}
