import axios, { AxiosResponse } from 'axios'
import { subgraphUrl } from 'constants/subgraphs'
import { BigNumber, utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { PayerReport } from 'models/subgraph-entities/payer-report'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { normalizeHandle } from 'utils/formatHandle'
import { formattedNum } from 'utils/formatNumber'
import { formatGraphQuery, trimHexZero } from 'utils/graph'

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
          query: formatGraphQuery({
            entity: 'payerReport',
            keys: ['payer', 'totalPaid', 'lastPaidTimestamp'],
            where: projectId
              ? {
                  key: 'project',
                  value: trimHexZero(projectId.toHexString()),
                }
              : undefined,
          }),
        },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then((res: AxiosResponse<{ data: { payerReport: PayerReport[] } }>) => {
        console.log('res', res)
      })
      .catch(err => console.log('Error getting payer reports', err))
  }, [projectId, setPayers, setPayerAmounts])

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
