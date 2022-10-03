import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { Tab } from 'components/Tab'
import { layouts } from 'constants/styles/layouts'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useAddressIsGnosisSafe } from 'hooks/AddressIsGnosisSafe'
import { useQueuedSafeTransactions } from 'hooks/safe/QueuedSafeTransactions'
import { generateSafeUrl } from 'lib/safe'
import { useContext, useState } from 'react'
import { ExecutedSafeTransactionsListing } from './ExecutedSafeTransactionsListing'

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
  safeTxGas: number
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

export type SafeTxCategory = 'queued' | 'history'
const SAFE_TX_QUEUED_KEY: SafeTxCategory = 'queued'
const SAFE_TX_HISTORY_KEY: SafeTxCategory = 'history'

const DEFAULT_TAB: SafeTxCategory = SAFE_TX_QUEUED_KEY

const TAB_NAMES: { [k in SafeTxCategory]: string } = {
  queued: t`Queued`,
  history: t`History`,
}

export function ProjectSafeDashboard() {
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [selectedTab, setSelectedTab] = useState<SafeTxCategory>(DEFAULT_TAB)

  const { data: queuedSafeTransactions, isLoading: isQueuedLoading } =
    useQueuedSafeTransactions({
      safeAddress: projectOwnerAddress,
    })
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

      {!isQueuedLoading ? (
        <ExternalLink
          href={generateSafeUrl(projectOwnerAddress)}
          style={{ textDecoration: 'underline' }}
        >
          <Trans>Go to your Safe</Trans>
        </ExternalLink>
      ) : null}

      {isQueuedLoading && <div style={{ marginTop: 20 }}>Loading...</div>}

      {!isQueuedLoading && (
        <div style={{ marginTop: '1.5rem' }}>
          <Space size="large">
            <Tab
              name={TAB_NAMES.queued}
              isSelected={selectedTab === SAFE_TX_QUEUED_KEY}
              onClick={() => setSelectedTab(SAFE_TX_QUEUED_KEY)}
            />
            <Tab
              name={TAB_NAMES.history}
              isSelected={selectedTab === SAFE_TX_HISTORY_KEY}
              onClick={() => setSelectedTab(SAFE_TX_HISTORY_KEY)}
            />
          </Space>

          <div style={{ marginTop: '1.5rem' }}>
            {selectedTab === SAFE_TX_QUEUED_KEY ? (
              <>
                {queuedSafeTransactions?.map(
                  (transaction: SafeTransactionType, idx: number) => (
                    <SafeTransaction
                      key={`safe-${transaction.nonce}-${idx}`}
                      transaction={transaction}
                    />
                  ),
                )}
              </>
            ) : selectedTab === SAFE_TX_HISTORY_KEY ? (
              <ExecutedSafeTransactionsListing
                safeAddress={projectOwnerAddress}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
