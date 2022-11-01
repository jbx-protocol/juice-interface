import { ThemeContext } from 'contexts/themeContext'
import DOMPurify from 'dompurify'
import { useContext, useMemo, useState } from 'react'
import { ipfsToHttps, isIpfsUrl } from 'utils/ipfs'

// Override select project logos.
const IMAGE_URI_OVERRIDES: { [k: number]: string } = {
  1: '/assets/juiceboxdao_logo.webp',
}

export default function ProjectLogo({
  uri,
  name,
  size,
  projectId,
}: {
  uri: string | undefined
  name: string | undefined
  size?: number
  projectId?: number | undefined
}) {
  const [srcLoadError, setSrcLoadError] = useState(false)
  const validImg = uri && !srcLoadError
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)
  const _size = size ?? 80

  const _uri = useMemo(() => {
    if (projectId && IMAGE_URI_OVERRIDES[projectId]) {
      return IMAGE_URI_OVERRIDES[projectId]
    }
    if (!uri) return undefined
    if (!isIpfsUrl(uri)) {
      return uri
    }
    return ipfsToHttps(uri)
  }, [uri, projectId])

  const _sanitizedUri = useMemo(() => {
    let sanitizedUri = ''
    const string = validImg
      ? `<img alt="${name}" style="max-height: 100%; min-width: 100%; object-fit: 'cover'; object-position: 'center'" src="${_uri}" onerror="${() =>
          setSrcLoadError(true)}"/>`
      : `<div
          style={{
            fontSize: '2.5rem',
          }}
        >
          🧃
        </div>`
    try {
      sanitizedUri = DOMPurify.sanitize(string ?? '')
    } catch (e) {
      console.error(e)
    }
    return sanitizedUri
  }, [_uri, validImg, name])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        height: _size,
        width: _size,
        borderRadius: radii.xl,
        background: validImg ? undefined : colors.background.l1,
      }}
      dangerouslySetInnerHTML={{ __html: _sanitizedUri }}
    ></div>
  )
}
