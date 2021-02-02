import React, { useState } from 'react'
import useContractReader from '../hooks/ContractReader'
import { Contracts } from '../models/contracts'
import Web3 from 'web3'
import { BigNumber } from '@ethersproject/bignumber'
import { Transactor } from '../models/transactor'
import { Button } from 'antd'
import { padding } from '../constants/styles/padding'

export default function TicketsBalance({
  ticketsHolderAddress,
  issuerAddress,
  contracts,
  transactor,
}: {
  ticketsHolderAddress?: string
  issuerAddress?: string
  contracts?: Contracts
  transactor?: Transactor
}) {
  const [redeemAmount, setRedeemAmount] = useState<BigNumber>(BigNumber.from(0))

  const balance = useContractReader<BigNumber>({
    contract: contracts?.TicketStore,
    functionName: 'getTicketBalance',
    args: [issuerAddress, ticketsHolderAddress],
  })

  const reserveTickets = useContractReader<{
    issuers: BigNumber
    beneficiaries: BigNumber
    admin: BigNumber
  }>({
    contract: contracts?.Juicer,
    functionName: 'getReservedTickets',
    args: [issuerAddress],
  })

  const hasReserves =
    reserveTickets !== undefined &&
    (reserveTickets.admin?.gt(0) ||
      reserveTickets.beneficiaries?.gt(0) ||
      reserveTickets.issuers?.gt(0))

  if (balance && balance !== redeemAmount) setRedeemAmount(balance)

  function redeem() {
    if (!transactor || !contracts) return

    const eth = new Web3(Web3.givenProvider).eth
    const _amount = eth.abi.encodeParameter('uint256', redeemAmount)

    console.log('🧃 Calling Juicer.redeem(issuerAddress, amount)', {
      issuerAddress,
      amount: _amount,
    })

    transactor(contracts?.Juicer.redeem(issuerAddress, _amount))
  }

  function mint() {
    if (!transactor || !contracts || !issuerAddress) return

    console.log('🧃 Calling Juicer.mintReservedTickets(owner)', {
      owner: issuerAddress,
    })

    transactor(contracts.Juicer.mintReservedTickets(issuerAddress))
  }

  const reserves = (
    <div style={{ color: '#fff' }}>
      Reserved tickets:
      {hasReserves && reserveTickets ? (
        <div>
          {reserveTickets.admin?.gt(0) ? (
            <div>Admin: {reserveTickets.admin.toString()}</div>
          ) : null}
          {reserveTickets.beneficiaries?.gt(0) ? (
            <div>Beneficiaries: {reserveTickets.beneficiaries.toString()}</div>
          ) : null}
          {reserveTickets.issuers?.gt(0) ? (
            <div>Owners: {reserveTickets.issuers.toString()}</div>
          ) : null}
        </div>
      ) : (
        ' --'
      )}
    </div>
  )

  const mintButton = <Button onClick={mint}>Mint reserves</Button>

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        background: '#000',
        color: '#fff',
        padding: padding.app,
        paddingTop: 10,
        paddingBottom: 10,
      }}
    >
      <div>Tickets: {balance !== undefined ? balance.toString() : '--'}</div>

      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <div style={{ marginRight: 40 }}>
          {reserves}
          {hasReserves ? mintButton : null}
        </div>

        <input
          onChange={e =>
            setRedeemAmount(BigNumber.from(parseFloat(e.target.value)))
          }
          style={{ marginRight: 10 }}
          type="number"
          placeholder="0"
          defaultValue="0"
        />

        <Button
          type="ghost"
          disabled={!balance}
          htmlType="submit"
          onClick={redeem}
        >
          Redeem
        </Button>
      </div>
    </div>
  )
}
