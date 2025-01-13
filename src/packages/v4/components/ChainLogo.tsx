import Image from "next/image";
import { JBChainId } from "juice-sdk-react";
import { NETWORKS } from "constants/networks";

const chainIdToLogo: Record<number, string> = {
  1: "/assets/images/chain-logos/mainnet.svg",
  11155111: "/assets/images/chain-logos/mainnet.svg",
  42161: "/assets/images/chain-logos/arbitrum.svg",
  421614: "/assets/images/chain-logos/arbitrum.svg",
  11155420: "/assets/images/chain-logos/optimism.svg",
  84532: "/assets/images/chain-logos/base.svg",
};

export const ChainLogo = ({
  chainId,
  width,
  height,
}: {
  chainId: JBChainId;
  width?: number;
  height?: number;
}) => {
  return (
    <Image
      src={chainIdToLogo[chainId]}
      alt={`${NETWORKS[chainId].label} Logo`}
      width={width ?? 20}
      height={height ?? 20}
    />
  );
};
