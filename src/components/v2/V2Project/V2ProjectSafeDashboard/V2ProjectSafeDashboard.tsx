import { Trans } from '@lingui/macro'
import { Tabs } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { layouts } from 'constants/styles/layouts'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useAddressIsGnosisSafe } from 'hooks/AddressIsGnosisSafe'
import { useQueuedSafeTransactions } from 'hooks/safe/QueuedSafeTransactions'
import { useContext } from 'react'
import { generateSafeUrl } from 'utils/safe'
import { SafeTransaction } from './SafeTransaction'
export interface SafeTransactionType {
  nonce: number
  origin: string
  data?: string
  dataDecoded?: {
    method: string
    parameters: object[]
  }
  isExecuted: boolean
  safeTxHash: string
  submissionDate: string
  executionDate: string
  confirmations?: {
    owner: string
    submissionDate: string
    transactionHash: string
    signature: string
    signatureType: string
  }[]
  safe: string
}

const { TabPane } = Tabs

export function V2ProjectSafeDashboard() {
  const { projectOwnerAddress } = useContext(V2ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { data: queuedSafeTransactions, isLoading } = useQueuedSafeTransactions(
    {
      safeAddress: projectOwnerAddress,
    },
  )
  const { data: ownerIsGnosisSafe, isLoading: ownerIsGnosisSafeLoading } =
    useAddressIsGnosisSafe(projectOwnerAddress)

  if (!projectOwnerAddress) return null

  if (!ownerIsGnosisSafeLoading && !ownerIsGnosisSafe) {
    return <div>Project is not owned by a Safe.</div>
  }

  return (
    <div style={{ ...layouts.maxWidth, margin: '2rem auto' }}>
      <h1 style={{ color: colors.text.primary, marginBottom: 5 }}>
        <Trans>Safe transactions</Trans>
      </h1>
      {!isLoading ? (
        <ExternalLink
          href={generateSafeUrl(projectOwnerAddress)}
          style={{ textDecoration: 'underline' }}
        >
          <Trans>Go to your Safe</Trans>
        </ExternalLink>
      ) : null}

      {isLoading && <div style={{ marginTop: 20 }}>Loading...</div>}

      {!isLoading && (
        <Tabs
          style={{ marginTop: 20 }}
          tabBarStyle={{ border: 'unset', marginBottom: 15 }}
        >
          <TabPane tab={<Trans>Queued</Trans>} key="1">
            {queuedSafeTransactions?.results.map(
              (transaction: SafeTransactionType, idx: number) => (
                <SafeTransaction
                  key={`safe-${transaction.nonce}-${idx}`}
                  transaction={transaction}
                />
              ),
            )}
          </TabPane>
        </Tabs>
      )}
    </div>
  )
}
