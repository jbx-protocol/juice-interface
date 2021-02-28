import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, DescriptionsProps, Switch } from 'antd'
import React, { useState } from 'react'
import { ContractName } from '../constants/contract-name'

import useContractReader, { ContractUpdateOn } from '../hooks/ContractReader'
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

  const wantTokenAddress = useContractReader<string>({
    contract: ContractName.Juicer,
    functionName: 'stablecoin',
  })

  const wantTokenName = useContractReader<string>({
    contract: erc20Contract(wantTokenAddress),
    functionName: 'symbol',
  })

  const emptyReserves: ReserveAmounts = {
    adminFees: BigNumber.from(0),
    beneficiaryDonations: BigNumber.from(0),
    issuerTickets: BigNumber.from(0),
  }

  const reservesUpdateOn: ContractUpdateOn = [
    {
      contract: contracts?.Juicer,
      eventName: 'Pay',
      topics: budget ? [budget.id.toString()] : undefined,
    },
    {
      contract: contracts?.Juicer,
      eventName: 'Redeem',
      topics: budget ? [[], budget.project] : undefined,
    },
    // TODO index property in Collect event for filtering against specific budget?
    // {
    //   contract: contracts?.Juicer,
    //   eventName: 'Collect',
    // },
  ]

  const distributableReserves = useContractReader<ReserveAmounts>({
    contract: ContractName.Juicer,
    functionName: 'getReserves',
    args: [budget?.project, true],
    formatter: val => val ?? emptyReserves,
    valueDidChange: (val, old) => {
      if (!val || (!val && !old)) return false
      return (
        val.adminFees.eq(old?.adminFees ?? 0) &&
        val.beneficiaryDonations.eq(old?.beneficiaryDonations ?? 0) &&
        val.issuerTickets.eq(old?.issuerTickets ?? 0)
      )
    },
    updateOn: reservesUpdateOn,
  })

  const reserves = useContractReader<ReserveAmounts>({
    contract: ContractName.Juicer,
    functionName: 'getReserves',
    args: [budget?.project, false],
    formatter: val => val ?? emptyReserves,
    valueDidChange: (val, old) => {
      if (!val || (!val && !old)) return false
      return (
        val.adminFees.eq(old?.adminFees ?? 0) &&
        val.beneficiaryDonations.eq(old?.beneficiaryDonations ?? 0) &&
        val.issuerTickets.eq(old?.issuerTickets ?? 0)
      )
    },
    updateOn: reservesUpdateOn,
  })

  const ticketSymbol = useContractReader<string>({
    contract: erc20Contract(ticketAddress),
    functionName: 'symbol',
  })

  const displayReserves = onlyDistributable ? distributableReserves : reserves

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
