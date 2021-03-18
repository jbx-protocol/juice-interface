import { ContractName } from 'constants/contract-name'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useCallback } from 'react'
import { useEffect, useRef } from 'react'
import { userTicketsActions } from 'redux/slices/userTickets'

import useContractReader from './ContractReader'
import { useErc20Contract } from './Erc20Contract'
import { NetworkName } from 'models/network-name'

export function useUserTickets(
  userAddress: string | undefined,
  network: NetworkName | undefined,
) {
  const dispatch = useAppDispatch()
  const didInitialCheck = useRef<{
    address: boolean
    symbol: boolean
    name: boolean
  }>({
    address: false,
    symbol: false,
    name: false,
  })

  const ticketsAddress = useContractReader<string>({
    contract: ContractName.TicketStore,
    functionName: 'tickets',
    args: userAddress ? [userAddress] : null,
    callback: () =>
      (didInitialCheck.current = {
        ...didInitialCheck.current,
        address: true,
      }),
  })

  const ticketContract = useErc20Contract(ticketsAddress, network)

  const ticketsSymbol = useContractReader<string>({
    contract: ticketContract,
    functionName: 'symbol',
    callback: () =>
      (didInitialCheck.current = {
        ...didInitialCheck.current,
        symbol: true,
      }),
  })

  const ticketsName = useContractReader<string>({
    contract: ticketContract,
    functionName: 'name',
    callback: () =>
      (didInitialCheck.current = {
        ...didInitialCheck.current,
        name: true,
      }),
  })

  // Undefined until tickets are checked for. If checked and not found, set to null.
  useEffect(() => {
    if (Object.values(didInitialCheck.current).some(v => !v)) return

    dispatch(
      userTicketsActions.set(
        ticketsSymbol && ticketsName && ticketsAddress
          ? {
              symbol: ticketsSymbol,
              name: ticketsName,
              address: ticketsAddress,
            }
          : null,
      ),
    )
  }, [ticketsSymbol, ticketsName, ticketsAddress, dispatch])
}
