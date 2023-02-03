import { BigNumber } from '@ethersproject/bignumber'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContractReadValue } from 'hooks/ContractReader'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import useTotalBalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { useJBV3Token } from '../contracts/JBV3Token'
import tokenStoreJson from '@jbx-protocol/juice-v3-migration/out/JBTokenStore.sol/JBTokenStore.json'

export function useV2TokenBalance({
  projectId,
}: {
  projectId: number | undefined
}) {
  const { tokenAddress } = useContext(V2V3ProjectContext)

  const JBV3TokenContract = useJBV3Token({ tokenAddress })
  const { userAddress } = useWallet()

  const { value: v2TokenStoreAddress } = useContractReadValue<string, string>({
    contract: JBV3TokenContract,
    functionName: 'v2TokenStore',
    args: [],
  })

  const v2TokenStoreContract = useLoadContractFromAddress({
    address: v2TokenStoreAddress,
    abi: tokenStoreJson.abi,
  })

  return (
    useTotalBalanceOf(
      userAddress,
      projectId,
      undefined,
      v2TokenStoreContract,
    ) ?? BigNumber.from(0)
  )
}
