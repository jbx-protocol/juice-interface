import {
  SuckerPair,
  jbTokensAbi,
  jbContractAddress,
  JBCoreContracts
} from "juice-sdk-core";
import { readContract } from "wagmi/actions";
import { useJBContractContext, useSuckers } from "juice-sdk-react";

import { useWallet } from "hooks/Wallet";
import { zeroAddress } from "viem";
import { useConfig } from "wagmi";
import { useQuery } from "wagmi/query";

export function useSuckersUnclaimedBalance() {
  const config = useConfig();
  const { userAddress } = useWallet();
  const { projectId: mainProjectId } = useJBContractContext();

  const suckersQuery = useSuckers();
  const pairs: SuckerPair[] = suckersQuery.data ?? [];

  const unclaimedBalanceQuery = useQuery({
    queryKey: [
      "suckersUnclaimedBalance",
      userAddress || "noUser",
      mainProjectId?.toString() || "0", 
      pairs?.map(p => p.peerChainId).join(",") || "noPairs",
    ],
    queryFn: async () => {
      if (!userAddress || !pairs || pairs.length === 0) return [];

      return await Promise.all(
        pairs.map(async pair => {
          const { peerChainId, projectId: peerProjectId } = pair;

          const tokensAddress = jbContractAddress['4'][JBCoreContracts.JBTokens][peerChainId];

          const unclaimedBalance = await readContract(config, {
            abi: jbTokensAbi,
            address: tokensAddress,
            functionName: 'creditBalanceOf',
            args: [userAddress ?? zeroAddress, peerProjectId],
            chainId: peerChainId,
          });

          return {
            chainId: peerChainId,
            projectId: peerProjectId,
            unclaimedBalance,
          };
        })
      );
    },
    enabled: !!userAddress,
  });

  return {
    isLoading: unclaimedBalanceQuery.isLoading || suckersQuery.isLoading,
    isError: unclaimedBalanceQuery.isError || suckersQuery.isError,
    data: unclaimedBalanceQuery.data as
      | {
          chainId: number;
          projectId: bigint;
          unclaimedBalance: bigint;
        }[]
      | undefined,
  };
}
