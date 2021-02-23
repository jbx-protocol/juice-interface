import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, DescriptionsProps, Switch } from 'antd'
import React, { useState } from 'react'
import Web3 from 'web3'

import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { erc20Contract } from '../utils/erc20Contract'
import { orEmpty } from '../utils/orEmpty'

type ReserveAmounts = {
  adminFees: BigNumber
  beneficiaryDonations: BigNumber
  issuerTickets: BigNumber
}

export default function Reserves({
  contracts,
  budget,
  ticketAddress,
  descriptionsStyle,
}: {
  contracts?: Contracts
  budget?: Budget
  ticketAddress?: string
  descriptionsStyle?: DescriptionsProps
}) {
  const [onlyDistributable, setOnlyDistributable] = useState<boolean>(false)

  const wantToken = useContractReader<string>({
    contract: contracts?.Juicer,
    functionName: 'stablecoin',
  })

  const wantTokenName = useContractReader<string>({
    contract: erc20Contract(wantToken),
    functionName: 'symbol',
  })

  const emptyReserves: ReserveAmounts = {
    adminFees: BigNumber.from(0),
    beneficiaryDonations: BigNumber.from(0),
    issuerTickets: BigNumber.from(0),
  }

  const distributableReserves = useContractReader<ReserveAmounts>({
    contract: contracts?.Juicer,
    functionName: 'getReserves',
    args: [budget?.owner, true],
    formatter: val => val ?? emptyReserves,
    shouldUpdate: (val, old) => {
      if (!val || (!val && !old)) return false
      return (
        val.adminFees.eq(old?.adminFees ?? 0) &&
        val.beneficiaryDonations.eq(old?.beneficiaryDonations ?? 0) &&
        val.issuerTickets.eq(old?.issuerTickets ?? 0)
      )
    },
  })

  const reserves = useContractReader<ReserveAmounts>({
    contract: contracts?.Juicer,
    functionName: 'getReserves',
    args: [budget?.owner, false],
    formatter: val => val ?? emptyReserves,
    shouldUpdate: (val, old) => {
      if (!val || (!val && !old)) return false
      return (
        val.adminFees.eq(old?.adminFees ?? 0) &&
        val.beneficiaryDonations.eq(old?.beneficiaryDonations ?? 0) &&
        val.issuerTickets.eq(old?.issuerTickets ?? 0)
      )
    },
  })

  const displayReserves = onlyDistributable ? distributableReserves : reserves

  const ticketSymbol = useContractReader<string>({
    contract: erc20Contract(ticketAddress),
    functionName: 'symbol',
    formatter: (value: string) =>
      value ? Web3.utils.hexToString(value) : undefined,
  })

  return (
    <Descriptions {...descriptionsStyle} column={1}>
      <Descriptions.Item label="Only distributable">
        <Switch
          defaultChecked={onlyDistributable}
          onChange={value => setOnlyDistributable(value)}
        ></Switch>
      </Descriptions.Item>
      <Descriptions.Item label="Admin reserves">
        {orEmpty(displayReserves?.adminFees?.toString())} {wantTokenName}
      </Descriptions.Item>
      <Descriptions.Item label="Donation reserves">
        {orEmpty(displayReserves?.beneficiaryDonations?.toString())}{' '}
        {wantTokenName}
      </Descriptions.Item>
      <Descriptions.Item label="Project owner reserves">
        {orEmpty(displayReserves?.issuerTickets?.toString())} {ticketSymbol}
      </Descriptions.Item>
    </Descriptions>
  )
}
