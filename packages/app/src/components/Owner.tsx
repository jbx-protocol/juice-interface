import { BigNumber } from '@ethersproject/bignumber'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Web3 from 'web3'

import { ContractName } from '../constants/contract-name'
import { localProvider } from '../constants/local-provider'
import useContractReader from '../hooks/ContractReader'
import useEventListener from '../hooks/EventListener'
import { Contracts } from '../models/contracts'
import { SustainEvent } from '../models/events/sustain-event'
import { MoneyPool } from '../models/money-pool'
import { Transactor } from '../models/transactor'
import ConfigureMoneyPool from './ConfigureMoneyPool'
import KeyValRow from './KeyValRow'
import MoneyPoolDetail from './MoneyPoolDetail'
import TicketsBalance from './TicketsBalance'

export default function Owner({
  address,
  transactor,
  contracts,
}: {
  address?: string
  transactor?: Transactor
  contracts?: Contracts
}) {
  const [sustainAmount, setSustainAmount] = useState<number>(0)

  const { owner }: { owner?: string } = useParams()

  const spacing = 30

  const isOwner = owner === address

  const currentMp = useContractReader<MoneyPool>({
    contract: contracts?.MpStore,
    functionName: 'getCurrentMp',
    args: [owner],
  })

  const queuedMp = useContractReader<MoneyPool>({
    contract: contracts?.MpStore,
    functionName: 'getQueuedMp',
    args: [owner],
  })

  const currentSustainEvents = (useEventListener({
    contracts,
    contractName: ContractName.Controller,
    eventName: 'SustainMp',
    provider: localProvider,
    startBlock: 1,
    getInitial: true,
    topics: currentMp?.id ? [BigNumber.from(currentMp?.id)] : [],
  }) as SustainEvent[])
    .filter(e => e.owner === owner)
    .filter(e => e.mpId.toNumber() === currentMp?.id.toNumber())

  function sustain() {
    if (!transactor || !contracts?.Controller || !currentMp?.owner) return

    const eth = new Web3(Web3.givenProvider).eth

    const amount = sustainAmount !== undefined ? eth.abi.encodeParameter('uint256', sustainAmount) : undefined

    console.log('🧃 Calling Controller.sustain(owner, amount, want, address)', {
      owner: currentMp.owner,
      amount,
      want: currentMp.want,
      address,
    })

    transactor(contracts.Controller.sustainOwner(currentMp.owner, amount, currentMp.want, address), () =>
      setSustainAmount(0),
    )
  }

  const configureMoneyPool = <ConfigureMoneyPool transactor={transactor} contracts={contracts} />

  function header(text: string) {
    return (
      <h4
        style={{
          margin: 0,
          textTransform: 'uppercase',
          color: '#777',
        }}
      >
        {text}
      </h4>
    )
  }

  function section(content?: JSX.Element, background = '#f2f2f2') {
    if (!content) return null

    return (
      <div
        style={{
          padding: spacing,
          marginBottom: spacing,
          background,
          borderRadius: 10,
        }}
      >
        {content}
      </div>
    )
  }

  const sustainments = (
    <div>
      <h3>Thanks to...</h3>
      {currentSustainEvents.length ? (
        currentSustainEvents.map((e, i) => (
          <div
            style={{
              marginBottom: 20,
              lineHeight: 1.2,
            }}
            key={i}
          >
            <div>Amount: {e.amount?.toNumber()}</div>
            <div>Sustainer: {e.sustainer}</div>
            <div>Beneficiary: {e.beneficiary}</div>
          </div>
        ))
      ) : (
        <div>No sustainments yet</div>
      )}
    </div>
  )

  const current = !currentMp ? null : (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'row',
        rowGap: spacing,
      }}
    >
      <div>
        {header('Current money pool')}

        {currentMp ? (
          <MoneyPoolDetail
            address={address}
            mp={currentMp}
            showSustained={true}
            showTimeLeft={true}
            contracts={contracts}
            transactor={transactor}
          />
        ) : (
          <div>Getting money pool...</div>
        )}
      </div>

      {currentMp
        ? KeyValRow(
            'Sustain money pool',
            <span>
              <input
                style={{ marginRight: 10 }}
                name="sustain"
                placeholder="0"
                onChange={e => setSustainAmount(parseFloat(e.target.value))}
              ></input>
              <button onClick={sustain}>Sustain</button>
            </span>,
          )
        : null}

      <a
        href={
          '/history/' + (currentMp?.total?.toNumber() ? currentMp?.id?.toNumber() : currentMp?.previous?.toNumber())
        }
      >
        Pool history
      </a>
    </div>
  )

  return (
    <div>
      <TicketsBalance
        contracts={contracts}
        issuerAddress={owner}
        ticketsHolderAddress={address}
        transactor={transactor}
      />

      <h3>{owner}</h3>

      <div
        style={{
          display: 'grid',
          columnGap: spacing,
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        }}
      >
        <div>
          {!currentMp ? (
            <a
              style={{
                fontWeight: 600,
                color: '#fff',
                textDecoration: 'none',
              }}
              href="/init"
            >
              {section(
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  Initialize tickets if you haven't yet!<span>&gt;</span>
                </div>,
                '#2255ff',
              )}
            </a>
          ) : null}

          {section(
            current ?? (
              <div>
                <h1 style={{ marginTop: 0 }}>Create money pool</h1>
                {configureMoneyPool}
              </div>
            ),
          )}

          {section(
            currentMp ? (
              <div
                style={{
                  display: 'grid',
                  gridAutoFlow: 'row',
                  rowGap: spacing,
                }}
              >
                {header('Queued Money Pool')}
                {queuedMp ? <MoneyPoolDetail mp={queuedMp} /> : <div>Nada</div>}
              </div>
            ) : (
              undefined
            ),
          )}

          {section(
            currentMp && isOwner ? (
              <div>
                {header('Reconfigure')}
                {configureMoneyPool}
              </div>
            ) : (
              undefined
            ),
          )}
        </div>

        {currentMp ? sustainments : null}
      </div>
    </div>
  )
}
