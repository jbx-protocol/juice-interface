import { BigNumber } from '@ethersproject/bignumber'
import { Button, Descriptions, DescriptionsProps, Switch } from 'antd'
import React, { useState } from 'react'
import Web3 from 'web3'

import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import { erc20Contract } from '../utils/erc20Contract'
import { orEmpty } from '../utils/orEmpty'

type ReserveAmounts = {
  adminFees: BigNumber
  beneficiaryDonations: BigNumber
  issuerTickets: BigNumber
}

export default function Reserves({
  contracts,
  transactor,
  budget,
  ticketAddress,
  descriptionsStyle,
  onNeedProvider,
}: {
  contracts?: Contracts
  transactor?: Transactor
  budget?: Budget
  ticketAddress?: string
  descriptionsStyle?: DescriptionsProps
  onNeedProvider: () => Promise<void>
}) {
  const [loadingMint, setLoadingMint] = useState<boolean>()
  const [onlyDistributable, setOnlyDistributable] = useState<boolean>(false)
  console.log('RESSS')

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

  function mint() {
    if (!budget) return

    if (!transactor || !contracts) return onNeedProvider()

    setLoadingMint(true)

    console.log('🧃 Calling Juicer.mintReservedTickets(owner)', {
      owner: budget.owner,
    })

    transactor(
      contracts.Juicer.mintReservedTickets(budget.owner),
      () => setLoadingMint(false),
      true,
    )
  }

  return (
    <div>
      <Descriptions {...descriptionsStyle} column={1}>
        <Descriptions.Item label="Only distributable">
          <Switch
            defaultChecked={onlyDistributable}
            onChange={value => setOnlyDistributable(value)}
          ></Switch>
        </Descriptions.Item>
        <Descriptions.Item label="Admin reserves">
          {orEmpty(displayReserves?.adminFees?.toString())} DAI
        </Descriptions.Item>
        <Descriptions.Item label="Beneficiaries reserves">
          {orEmpty(displayReserves?.beneficiaryDonations?.toString())} DAI
        </Descriptions.Item>
        <Descriptions.Item label="Issuers reserves">
          {orEmpty(displayReserves?.issuerTickets?.toString())} {ticketSymbol}
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
