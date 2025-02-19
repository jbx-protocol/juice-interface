import { NETWORKS } from 'constants/networks'
import { JBChainId } from 'juice-sdk-react'
import Image from 'next/image'
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from 'viem/chains'

const chainIdToLogo: Record<JBChainId, string> = {
  [mainnet.id]: '/assets/images/chain-logos/mainnet.svg',
  [sepolia.id]: '/assets/images/chain-logos/mainnet.svg',

  [arbitrum.id]: '/assets/images/chain-logos/arbitrum.svg',
  [arbitrumSepolia.id]: '/assets/images/chain-logos/arbitrum.svg',

  [optimism.id]: '/assets/images/chain-logos/optimism.svg',
  [optimismSepolia.id]: '/assets/images/chain-logos/optimism.svg',

  [base.id]: '/assets/images/chain-logos/base.svg',
  [baseSepolia.id]: '/assets/images/chain-logos/base.svg',
}

export const ChainLogo = ({
  chainId,
  width,
  height,
}: {
  chainId: JBChainId
  width?: number
  height?: number
}) => {
  return (
    <Image
      src={chainIdToLogo[chainId]}
      alt={`${NETWORKS[chainId].label} Logo`}
      width={width ?? 20}
      height={height ?? 20}
    />
  )
}
