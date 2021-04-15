import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ContractName } from 'models/contract-name'
import useContractReader from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'

export function useWeth(
  provider?: JsonRpcProvider,
):
  | Partial<{
      contract: Contract
      symbol: string
      address: string
    }>
  | undefined {
  const address = useContractReader<string>({
    contract: ContractName.Juicer,
    functionName: 'weth',
    provider,
  })

  const contract = useErc20Contract(address, provider)

  const symbol = useContractReader<string>({
    contract,
    functionName: 'symbol',
    provider,
  })

  return { address, contract, symbol }
}
