import {
  SuckerPair,
  readJbControllerPendingReservedTokenBalanceOf,
  readJbDirectoryControllerOf
} from "juice-sdk-core";
import { useJBChainId, useJBContractContext, useSuckers } from "juice-sdk-react";

import { useConfig } from "wagmi";
import { useQuery } from "wagmi/query";
import { wagmiConfig } from "../wagmiConfig";

export function useSuckersPendingReservedTokens() {
  const config = useConfig();

  const chainId = useJBChainId();

  const { projectId } = useJBContractContext();

  const suckersQuery = useSuckers();
  const pairs: SuckerPair[] = suckersQuery.data ?? [];

  const pendingReservedTokensQuery = useQuery({
    queryKey: [
      "suckersPendingReservedTokens",
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

          const controllerAddress = await readJbDirectoryControllerOf(wagmiConfig, {
            chainId,
            args: [BigInt(projectId)],
          })

          const pendingReservedTokens = await readJbControllerPendingReservedTokenBalanceOf(config, {
            chainId: Number(peerChainId),
            address: controllerAddress,
            args: [peerProjectId],
          });

          return {
            chainId: peerChainId,
            projectId: peerProjectId,
            pendingReservedTokens,
          };
        })
      );
    },
  });

  return {
    isLoading: pendingReservedTokensQuery.isLoading || suckersQuery.isLoading,
    isError: pendingReservedTokensQuery.isError || suckersQuery.isError,
    data: pendingReservedTokensQuery.data as
      | {
          chainId: number;
          projectId: bigint;
          pendingReservedTokens: bigint;
        }[]
      | undefined,
  };
}
