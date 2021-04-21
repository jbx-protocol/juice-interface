import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import useContractReader from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { ContractName } from 'models/contract-name'
import { useReadProvider } from 'utils/providers'

export function useWeth(
  provider?: JsonRpcProvider,
):
  | Partial<{
      contract: Contract
      symbol: string
      address: string
    }>
  | undefined {
  const readProvider = useReadProvider()

  const _provider = provider ?? readProvider

  const address = useContractReader<string>({
    contract: ContractName.Juicer,
    functionName: 'weth',
    provider: _provider,
  })

  const contract = useErc20Contract(address, _provider)

  const symbol = useContractReader<string>({
    contract,
    functionName: 'symbol',
    provider: _provider,
  })

  return { address, contract, symbol }
}
