import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { Tab } from 'components/Tab'
import { layouts } from 'constants/styles/layouts'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useAddressIsGnosisSafe } from 'hooks/AddressIsGnosisSafe'
import { useQueuedSafeTransactions } from 'hooks/safe/QueuedSafeTransactions'
import { generateSafeUrl } from 'lib/safe'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CSSProperties, useContext, useState } from 'react'
import { v2v3ProjectRoute } from 'utils/routes'
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
  const { projectOwnerAddress, handle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { query } = useRouter()

  const preSelectedTab = query.tab as SafeTxCategory
  const [selectedTab, setSelectedTab] = useState<SafeTxCategory>(
    preSelectedTab ?? DEFAULT_TAB,
  )

  const preSelectedTx = query.tx as string

  if (preSelectedTx) {
    document
      .getElementById(preSelectedTx)
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  const { data: queuedSafeTransactions, isLoading } = useQueuedSafeTransactions(
    {
      safeAddress: projectOwnerAddress,
    },
  )
  const { data: ownerIsGnosisSafe, isLoading: ownerIsGnosisSafeLoading } =
    useAddressIsGnosisSafe(projectOwnerAddress)

  if (!projectOwnerAddress) return null

  const containerStyle: CSSProperties = {
    ...layouts.maxWidth,
    margin: '2rem auto',
  }

  if (!ownerIsGnosisSafeLoading && !ownerIsGnosisSafe) {
    return (
      <div style={containerStyle}>
        <Trans>Project is not owned by a Safe.</Trans>
      </div>
    )
  }

  const projectSafeRoute = `${v2v3ProjectRoute({ projectId, handle })}/safe`

  return (
    <div style={containerStyle}>
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
        <div style={{ marginTop: '1.5rem' }}>
          <Space size="large">
            <Link href={`${projectSafeRoute}?tab=queued`}>
              <a>
                <Tab
                  name={TAB_NAMES.queued}
                  isSelected={selectedTab === SAFE_TX_QUEUED_KEY}
                  onClick={() => setSelectedTab(SAFE_TX_QUEUED_KEY)}
                />
              </a>
            </Link>
            <Link href={`${projectSafeRoute}?tab=history`}>
              <a>
                <Tab
                  name={TAB_NAMES.history}
                  isSelected={selectedTab === SAFE_TX_HISTORY_KEY}
                  onClick={() => setSelectedTab(SAFE_TX_HISTORY_KEY)}
                />
              </a>
            </Link>
          </Space>

          <div style={{ marginTop: '1.5rem' }}>
            {selectedTab === SAFE_TX_QUEUED_KEY ? (
              <>
                {queuedSafeTransactions?.map(
                  (transaction: SafeTransactionType, idx: number) => (
                    <SafeTransaction
                      key={`safe-${transaction.nonce}-${idx}`}
                      transaction={transaction}
                      selected={preSelectedTx === transaction.safeTxHash}
                    />
                  ),
                )}
              </>
            ) : selectedTab === SAFE_TX_HISTORY_KEY ? (
              <ExecutedSafeTransactionsListing
                safeAddress={projectOwnerAddress}
                selectedTx={preSelectedTx}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
