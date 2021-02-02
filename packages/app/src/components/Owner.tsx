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
import { Budget } from '../models/budget'
import { Transactor } from '../models/transactor'
import ConfigureBudget from './ConfigureBudget'
import KeyValRow from './KeyValRow'
import BudgetDetail from './BudgetDetail'
import TicketsBalance from './TicketsBalance'
import { padding } from '../constants/styles/padding'
import { Button } from 'antd'

export default function Owner({
  providerAddress,
  transactor,
  contracts,
}: {
  providerAddress?: string
  transactor?: Transactor
  contracts?: Contracts
}) {
  const [sustainAmount, setSustainAmount] = useState<number>(0)

  const { owner }: { owner?: string } = useParams()

  const spacing = 30

  const isOwner = owner === providerAddress

  const currentBudget = useContractReader<Budget>({
    contract: contracts?.BudgetStore,
    functionName: 'getCurrentBudget',
    args: [owner],
  })

  const queuedBudget = useContractReader<Budget>({
    contract: contracts?.BudgetStore,
    functionName: 'getQueuedBudget',
    args: [owner],
  })

  const currentSustainEvents = (useEventListener({
    contracts,
    contractName: ContractName.Juicer,
    eventName: 'SustainBudget',
    provider: localProvider,
    startBlock: 1,
    getInitial: true,
    topics: currentBudget?.id ? [BigNumber.from(currentBudget?.id)] : [],
  }) as SustainEvent[])
    .filter(e => e.owner === owner)
    .filter(e => e.budgetId.toNumber() === currentBudget?.id.toNumber())

  function sustain() {
    if (!transactor || !contracts?.Juicer || !currentBudget?.owner) return

    const eth = new Web3(Web3.givenProvider).eth

    const amount =
      sustainAmount !== undefined
        ? eth.abi.encodeParameter('uint256', sustainAmount)
        : undefined

    console.log(
      '🧃 Calling Controller.sustain(owner, amount, want, providerAddress)',
      {
        owner: currentBudget.owner,
        amount,
        want: currentBudget.want,
        providerAddress,
      },
    )

    transactor(
      contracts.Juicer.sustainOwner(
        currentBudget.owner,
        amount,
        currentBudget.want,
        providerAddress,
      ),
      () => setSustainAmount(0),
    )
  }

  const configureBudget = (
    <ConfigureBudget transactor={transactor} contracts={contracts} />
  )

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

  const current = !currentBudget ? null : (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'row',
        rowGap: spacing,
      }}
    >
      <div>
        {header('Current money pool')}

        {currentBudget ? (
          <BudgetDetail
            providerAddress={providerAddress}
            budget={currentBudget}
            showSustained={true}
            showTimeLeft={true}
            contracts={contracts}
            transactor={transactor}
          />
        ) : (
          <div>Getting money pool...</div>
        )}
      </div>

      {currentBudget
        ? KeyValRow(
            'Sustain money pool',
            <span>
              <input
                style={{ marginRight: 10 }}
                name="sustain"
                placeholder="0"
                onChange={e => setSustainAmount(parseFloat(e.target.value))}
              ></input>
              <Button onClick={sustain}>Sustain</Button>
            </span>,
          )
        : null}

      <a
        href={
          '/history/' +
          (currentBudget?.total?.toNumber()
            ? currentBudget?.id?.toNumber()
            : currentBudget?.previous?.toNumber())
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
        ticketsHolderAddress={providerAddress}
        transactor={transactor}
      />
      <div style={{ padding: padding.app }}>
        <h3>{owner}</h3>

        <div
          style={{
            display: 'grid',
            columnGap: spacing,
            marginTop: 20,
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          }}
        >
          <div>
            {!currentBudget ? (
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
                  {configureBudget}
                </div>
              ),
            )}

            {section(
              currentBudget ? (
                <div
                  style={{
                    display: 'grid',
                    gridAutoFlow: 'row',
                    rowGap: spacing,
                  }}
                >
                  {header('Queued Budget')}
                  {queuedBudget ? (
                    <BudgetDetail budget={queuedBudget} />
                  ) : (
                    <div>Nada</div>
                  )}
                </div>
              ) : (
                undefined
              ),
            )}

            {section(
              currentBudget && isOwner ? (
                <div>
                  {header('Reconfigure')}
                  {configureBudget}
                </div>
              ) : (
                undefined
              ),
            )}
          </div>

          {currentBudget ? sustainments : null}
        </div>
      </div>
    </div>
  )
}
