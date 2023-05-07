import V1TicketBoothJson from '@jbx-protocol/contracts-v1/deployments/mainnet/TicketBooth.json'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { Contract } from 'ethers'
import { useContractReadValue } from 'hooks/ContractReader'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import { useContext } from 'react'
import { useJBV3Token } from '../contracts/useJBV3Token'

export function useV1TicketBoothForV3Token(): Contract | undefined {
  const { tokenAddress } = useContext(V2V3ProjectContext)

  const JBV3TokenContract = useJBV3Token({ tokenAddress })

  const { value: v1TicketBoothAddress } = useContractReadValue<string, string>({
    contract: JBV3TokenContract,
    functionName: 'v1TicketBooth',
    args: [],
  })
  const V1TicketBooth = useLoadContractFromAddress({
    address: v1TicketBoothAddress,
    abi: V1TicketBoothJson.abi,
  })

  return V1TicketBooth
}
