import { useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { cidFromUrl, ipfsGatewayUrl, ipfsUriToGatewayUrl } from 'utils/ipfs'

// Override some project logos.
const IMAGE_URI_OVERRIDES: { [k: number]: string } = {
  1: '/assets/images/juiceboxdao_logo.webp', // the on-chain logo's filesize is too large. This is a smaller version.
}

export default function ProjectLogo({
  className,
  uri,
  name,
  projectId,
  pv,
  lazyLoad,
  fallback = '🧃',
}: {
  name: string | undefined
  className?: string
  uri?: string | undefined
  projectId?: number | undefined
  pv?: number | undefined
  lazyLoad?: boolean
  fallback?: string | JSX.Element | null
}) {
  const [srcLoadError, setSrcLoadError] = useState(false)
  const [loading, setLoading] = useState(true)

  const imageSrc = useMemo(() => {
    if (!projectId) return undefined

    if (IMAGE_URI_OVERRIDES[projectId]) {
      return IMAGE_URI_OVERRIDES[projectId]
    }

    if (!uri) return `/api/juicebox/pv/${pv}/project/${projectId}/logo`

    // Some older JB projects have a logo URI hardcoded to use Pinata.
    // JBM no longer uses Pinata.
    // This rewrites those URLs to use the Infura gateway.
    if (uri.startsWith('https://jbx.mypinata.cloud')) {
      const cid = cidFromUrl(uri)
      return ipfsGatewayUrl(cid)
    }

    return ipfsUriToGatewayUrl(uri)
  }, [uri, projectId, pv])

  const validImg = imageSrc && !srcLoadError

  return (
    <div
      className={twMerge(
        'flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg text-4xl',
        'bg-smoke-100 dark:bg-slate-700',
        loading ? 'animate-pulse' : undefined,
        className,
      )}
    >
      {validImg ? (
        <img
          className="h-full w-full object-cover object-center"
          src={imageSrc}
          alt={name + ' logo'}
          onError={() => setSrcLoadError(true)}
          onLoad={() => setLoading(false)}
          loading={lazyLoad ? 'lazy' : undefined}
          crossOrigin="anonymous"
          title={name}
        />
      ) : null}

      {!validImg ? <span title={name}>{fallback}</span> : null}
    </div>
  )
}
