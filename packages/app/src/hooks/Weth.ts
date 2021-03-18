import { Contract } from '@ethersproject/contracts'
import { ContractName } from 'constants/contract-name'
import useContractReader from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { NetworkName } from 'models/network-name'

export function useWeth(
  network: NetworkName | undefined,
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
    network,
  })

  const contract = useErc20Contract(address, network)

  const symbol = useContractReader<string>({
    contract,
    functionName: 'symbol',
    network,
  })

  return { address, contract, symbol }
}
