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
import { useRouter } from 'next/router'
// import { useRouter } from 'next/router'
import { CSSProperties, useContext, useState } from 'react'
// import { v2v3ProjectRoute } from 'utils/routes'
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
  // const { replace: routerReplace, query, pathname } = useRouter()
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

  // useEffect(() => {
  //   routerReplace(`${v2v3ProjectRoute({projectId, handle})}/safe?tab=${selectedTab}`)
  // }, [selectedTab, routerReplace, pathname])

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
                      selected={preSelectedTx === transaction.safeTxHash}
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
