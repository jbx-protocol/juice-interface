import { useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ipfsToHttps, isIpfsUrl } from 'utils/ipfs'
import Image from 'next/image'

// Override select project logos.
const IMAGE_URI_OVERRIDES: { [k: number]: string } = {
  1: '/assets/juiceboxdao_logo.webp',
}

export default function ProjectLogo({
  className,
  uri,
  name,
  projectId,
}: {
  className?: string
  uri: string | undefined
  name: string | undefined
  projectId?: number | undefined
}) {
  const [srcLoadError, setSrcLoadError] = useState(false)
  const validImg = uri && !srcLoadError

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

  return (
    <div
      className={twMerge(
        'relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-sm',
        !validImg ? 'bg-smoke-100 dark:bg-slate-600' : 'undefined',
        className,
      )}
    >
      {validImg && _uri ? (
        <Image
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          src={_uri}
          alt={name + ' logo'}
          onError={() => setSrcLoadError(true)}
          loading="lazy"
          crossOrigin="anonymous"
        />
      ) : (
        <div className="text-4xl">🧃</div>
      )}
    </div>
  )
}
