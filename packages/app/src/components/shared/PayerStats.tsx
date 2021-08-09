import axios, { AxiosResponse } from 'axios'
import { subgraphUrl } from 'constants/subgraphs'
import { BigNumber, utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { PayEvent } from 'models/events/pay-event'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { normalizeHandle } from 'utils/formatHandle'
import { formattedNum, fromWad } from 'utils/formatNumber'
import { formatGraphQuery } from 'utils/graph'

import CurrencySymbol from './CurrencySymbol'
import FormattedAddress from './FormattedAddress'

export default function PayerStats() {
  const { handle }: { handle?: string } = useParams()
  const [payers, setPayers] = useState<string[]>()
  const [payerAmounts, setPayerAmounts] = useState<Record<string, number>>({})

  const projectId = useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: 'projectFor',
    args: handle ? [utils.formatBytes32String(normalizeHandle(handle))] : null,
  })

  useEffect(() => {
    // Load pay stats
    axios
      .post(
        subgraphUrl,
        {
          query: formatGraphQuery<PayEvent>({
            entity: 'payEvent',
            keys: ['amount', 'caller'],
            where: projectId
              ? {
                  key: 'projectId',
                  value: projectId.toString(),
                }
              : undefined,
          }),
        },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then((res: AxiosResponse<{ data: { payEvents: PayEvent[] } }>) => {
        let payers: string[] = []
        let payersMap: Record<string, number> = {}

        res.data.data?.payEvents.forEach(e => {
          if (!payers.includes(e.caller)) payers.push(e.caller)

          payersMap[e.caller] =
            (payersMap[e.caller] ?? 0) + parseFloat(fromWad(e.amount))
        })

        setPayers(payers.sort((a, b) => (payersMap[a] < payersMap[b] ? 1 : -1)))
        setPayerAmounts(payersMap)

        console.log('payers', {
          count: payers.length,
          amounts: payersMap,
        })
      })
      .catch(err => console.log('Error getting pay events', err))
  }, [projectId])

  return (
    <div style={{ padding: 80 }}>
      <h2>{handle}</h2>
      <div style={{ marginBottom: 20 }}>Total payers: {payers?.length}</div>
      {payers?.map(p => (
        <div
          key={p}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: 300,
          }}
        >
          <div>{<FormattedAddress address={p} />}: </div>
          <div>
            <CurrencySymbol currency={0} />
            {formattedNum(payerAmounts[p] ?? 0)}
          </div>
        </div>
      ))}
    </div>
  )
}
