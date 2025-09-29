import {
  SuckerPair,
  jbDirectoryAbi,
  jbControllerAbi,
  jbContractAddress,
  JBCoreContracts
} from "juice-sdk-core";
import { readContract } from "wagmi/actions";
import { useJBChainId, useJBContractContext, useSuckers } from "juice-sdk-react";
import { useConfig } from "wagmi";
import { useQuery } from "wagmi/query";
import { useV4V5Version } from '../contexts/V4V5VersionProvider';

export function useSuckersTotalSupply() {
  const config = useConfig();
  const { version } = useV4V5Version();
  const versionString = version.toString() as '4' | '5';

  const chainId = useJBChainId();

  const { projectId } = useJBContractContext();

  const suckersQuery = useSuckers();
  const pairs: SuckerPair[] = suckersQuery.data ?? [];

  const totalSupplyQuery = useQuery({
    queryKey: [
      "suckersTotalSupply",
      projectId?.toString() || "0",
      chainId?.toString() || "0",
      pairs?.map(p => p.peerChainId).join(",") || "noPairs",
    ],
    queryFn: async () => {
      if (!chainId) return null;
      if (!pairs || pairs.length === 0) return [];

      return await Promise.all(
        pairs.map(async pair => {
          const { peerChainId, projectId: peerProjectId } = pair;

          const directoryAddress = jbContractAddress[versionString][JBCoreContracts.JBDirectory][chainId];

          const controllerAddress = await readContract(config, {
            abi: jbDirectoryAbi,
            address: directoryAddress,
            functionName: 'controllerOf',
            args: [BigInt(projectId)],
            chainId,
          });

          const totalSupply = await readContract(config, {
            abi: jbControllerAbi,
            address: controllerAddress,
            functionName: 'totalTokenSupplyWithReservedTokensOf',
            args: [peerProjectId],
            chainId: Number(peerChainId),
          });

          return {
            chainId: peerChainId,
            projectId: peerProjectId,
            totalSupply,
          };
        })
      );
    },
  });

  return {
    isLoading: totalSupplyQuery.isLoading || suckersQuery.isLoading,
    isError: totalSupplyQuery.isError || suckersQuery.isError,
    data: totalSupplyQuery.data as
      | {
          chainId: number;
          projectId: bigint;
          totalSupply: bigint;
        }[]
      | undefined,
  };
}
