import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Button, Descriptions, DescriptionsProps } from 'antd'
import React, { useState } from 'react'
import Web3 from 'web3'

import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import { erc20Contract } from '../utils/erc20Contract'
import { orEmpty } from '../utils/orEmpty'

export default function Reserves({
  contracts,
  transactor,
  budget,
  ticketAddress,
  descriptionsStyle,
  provider,
}: {
  contracts?: Contracts
  transactor?: Transactor
  budget?: Budget
  ticketAddress?: string
  descriptionsStyle?: DescriptionsProps
  provider?: JsonRpcProvider
}) {
  const [loadingMint, setLoadingMint] = useState<boolean>()

  const reserveAmounts = useContractReader<{
    adminFees: BigNumber
    beneficiaryDonations: BigNumber
    issuerTickets: BigNumber
  }>({
    contract: contracts?.Juicer,
    functionName: 'getDistributableReserves',
    args: [budget?.owner],
    shouldUpdate: (val, old) => {
      if (!val || (!val && !old)) return false
      return (
        val.adminFees.eq(old?.adminFees ?? 0) &&
        val.beneficiaryDonations.eq(old?.beneficiaryDonations ?? 0) &&
        val.issuerTickets.eq(old?.issuerTickets ?? 0)
      )
    },
  })

  const ticketSymbol = useContractReader<string>({
    contract: erc20Contract(ticketAddress, provider),
    functionName: 'symbol',
    formatter: (value: string) =>
      value ? Web3.utils.hexToString(value) : undefined,
  })

  function mint() {
    if (!transactor || !contracts || !budget) return

    setLoadingMint(true)

    console.log('🧃 Calling Juicer.mintReservedTickets(owner)', {
      owner: budget.owner,
    })

    transactor(contracts.Juicer.mintReservedTickets(budget.owner), () =>
      setLoadingMint(false),
    )
  }

  return (
    <div>
      <Descriptions {...descriptionsStyle} column={1}>
        <Descriptions.Item label="Admin reserves">
          {orEmpty(reserveAmounts?.adminFees?.toString())} DAI
        </Descriptions.Item>
        <Descriptions.Item label="Beneficiaries reserves">
          {orEmpty(reserveAmounts?.beneficiaryDonations?.toString())} DAI
        </Descriptions.Item>
        <Descriptions.Item label="Issuers reserves">
          {orEmpty(reserveAmounts?.issuerTickets?.toString())} {ticketSymbol}
        </Descriptions.Item>
      </Descriptions>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 10,
        }}
      >
        <Button onClick={mint} loading={loadingMint}>
          Mint reserves
        </Button>
      </div>
    </div>
  )
}
