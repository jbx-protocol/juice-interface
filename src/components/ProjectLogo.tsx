import { useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  cidFromUrl,
  ipfsGatewayUrl,
  ipfsUriToGatewayUrl,
  isIpfsUri,
} from 'utils/ipfs'

// Override some project logos.
const IMAGE_URI_OVERRIDES: { [k: number]: string } = {
  1: '/assets/juiceboxdao_logo.webp', // the on-chain logo's filesize is too large. This is a smaller version.
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

  const imageSrc = useMemo(() => {
    if (projectId && IMAGE_URI_OVERRIDES[projectId]) {
      return IMAGE_URI_OVERRIDES[projectId]
    }
    if (!uri) return undefined

    // Some older JB projects have a logo URI hardcoded to use Pinata.
    // JBM no longer uses Pinata.
    // This rewrites those URLs to use the Infura gateway.
    if (uri.startsWith('https://jbx.mypinata.cloud')) {
      const cid = cidFromUrl(uri)
      return ipfsGatewayUrl(cid)
    }

    if (!isIpfsUri(uri)) {
      return uri
    }
    return ipfsUriToGatewayUrl(uri)
  }, [uri, projectId])

  return (
    <div
      className={twMerge(
        'flex h-20 w-20 items-center justify-center overflow-hidden rounded-sm',
        !validImg ? 'bg-smoke-100 dark:bg-slate-600' : 'undefined',
        className,
      )}
    >
      {validImg ? (
        <img
          className="max-h-full max-w-full object-cover object-center"
          src={imageSrc}
          alt={name + ' logo'}
          onError={() => setSrcLoadError(true)}
          loading="lazy"
          crossOrigin="anonymous"
          title={name}
        />
      ) : (
        <div className="text-4xl" title={name}>
          🧃
        </div>
      )}
    </div>
  )
}
