import { readNetwork } from 'constants/networks'
import { PV_V2 } from 'constants/pv'
import { NetworkName } from 'models/networkName'
import { PV } from 'models/pv'
import { useMemo } from 'react'
import { cidFromUrl, ipfsGatewayUrl, ipfsUriToGatewayUrl } from 'utils/ipfs'

// Override some project logos.
const imageUriOverridePath = '/assets/images/image-uri-overrides'
const MAINNET_URI_OVERRIDES: { [k: number]: { [j: string]: string } } = {
  1: {
    [PV_V2]: `${imageUriOverridePath}/juiceboxdao_logo.webp`,
  }, // the on-chain logo's filesize is too large. This is a smaller version.
  470: {
    [PV_V2]: `${imageUriOverridePath}/breadfruit_logo.webp`,
  },
}

const SEPOLIA_URI_OVERRIDES: { [k: number]: { [j: string]: string } } = {
  1: { [PV_V2]: `${imageUriOverridePath}/juiceboxdao_logo.webp` }, // the on-chain logo's filesize is too large. This is a smaller version.
}

const imgOverrideForProjectId = (projectId: number, pv: PV) => {
  switch (readNetwork.name) {
    case NetworkName.mainnet:
      return MAINNET_URI_OVERRIDES[pv]?.[projectId]
    case NetworkName.sepolia:
      return SEPOLIA_URI_OVERRIDES[pv]?.[projectId]
  }
}

type UseProjectLogoSrcProps = {
  projectId?: number
  uri?: string | undefined
  pv?: PV | undefined
}

export const useProjectLogoSrc = ({
  projectId,
  uri,
  pv,
}: UseProjectLogoSrcProps) => {
  /**
   * If URI is passed, use it.
   * If URI isn't passed or is undefined, use the API logo. THIS REQUIRES PV + PROJECT ID
   */
  const imageSrc = useMemo(() => {
    if (projectId && pv) {
      const override = imgOverrideForProjectId(projectId, pv)
      if (override) return override
    }

    if (!uri) {
      // Attempt to use the API logo if projectId and pv exists.
      if (projectId && pv) {
        return `/api/juicebox/pv/${pv}/project/${projectId}/logo`
      }

      return undefined
    }

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

  return imageSrc
}
