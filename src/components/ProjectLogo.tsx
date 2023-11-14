import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/networkName'
import { PV } from 'models/pv'
import { useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { cidFromUrl, ipfsGatewayUrl, ipfsUriToGatewayUrl } from 'utils/ipfs'

// Override some project logos.
const imageUriOverridePath = '/assets/images/image-uri-overrides'
const MAINNET_URI_OVERRIDES: { [k: number]: string } = {
  1: `${imageUriOverridePath}/juiceboxdao_logo.webp`, // the on-chain logo's filesize is too large. This is a smaller version.
  470: `${imageUriOverridePath}/breadfruit_logo.webp`,
}

const GOERLI_URI_OVERRIDES: { [k: number]: string } = {
  1: `${imageUriOverridePath}/juiceboxdao_logo.webp`, // the on-chain logo's filesize is too large. This is a smaller version.
}

type ProjectLogoBaseProps = {
  className?: string
  name?: string
  projectId?: number
  lazyLoad?: boolean
  fallback?: string | JSX.Element | null
  uri?: string | undefined
  pv?: PV | undefined
}

export default function ProjectLogo({
  className,
  name,
  projectId,
  lazyLoad,
  fallback = '🧃',
  uri,
  pv,
}: ProjectLogoBaseProps) {
  const [srcLoadError, setSrcLoadError] = useState(false)
  /**
   * If URI is passed, use it.
   * If URI isn't passed or is undefined, use the API logo. THIS REQUIRES PV + PROJECT ID
   */
  const imageSrc = useMemo(() => {
    if (
      projectId &&
      readNetwork.name === NetworkName.mainnet &&
      MAINNET_URI_OVERRIDES[projectId]
    )
      return MAINNET_URI_OVERRIDES[projectId]

    if (
      projectId &&
      readNetwork.name === NetworkName.goerli &&
      GOERLI_URI_OVERRIDES[projectId]
    )
      return GOERLI_URI_OVERRIDES[projectId]

    if (!uri) return `/api/juicebox/pv/${pv}/project/${projectId}/logo`

    // Some older JB projects have a logo URI hardcoded to use Pinata.
    // JBM no longer uses Pinata.
    // This rewrites those URLs to use the Infura gateway.
    if (uri.startsWith('https://jbx.mypinata.cloud')) {
      const cid = cidFromUrl(uri)
      // Use `/api/image/[url].ts` to validate filetype.
      return `/api/image/${encodeURIComponent(ipfsGatewayUrl(cid))}`
    }

    return `/api/image/${encodeURIComponent(ipfsUriToGatewayUrl(uri))}`
  }, [uri, projectId, pv])

  const validImg = imageSrc && !srcLoadError

  return (
    <div
      className={twMerge(
        'flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg text-4xl',
        'bg-smoke-100 dark:bg-slate-700',
        className,
      )}
    >
      {validImg ? (
        <img
          className="h-full w-full object-cover object-center"
          src={imageSrc}
          alt={name + ' logo'}
          onError={() => setSrcLoadError(true)}
          loading={lazyLoad ? 'lazy' : undefined}
          crossOrigin="anonymous"
          title={name}
        />
      ) : null}

      {!validImg ? <span title={name}>{fallback}</span> : null}
    </div>
  )
}
