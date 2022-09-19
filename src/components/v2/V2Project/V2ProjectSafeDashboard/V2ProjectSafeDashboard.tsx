import { t, Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { Tab } from 'components/Tab'
import { layouts } from 'constants/styles/layouts'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useAddressIsGnosisSafe } from 'hooks/AddressIsGnosisSafe'
import { useQueuedSafeTransactions } from 'hooks/safe/QueuedSafeTransactions'
import { generateSafeUrl } from 'lib/safe'
import { useContext, useState } from 'react'
import { v2ProjectRoute } from 'utils/routes'

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
const defaultTab: SafeTxCategory = 'queued'

const TAB_NAMES: { [k in SafeTxCategory]: string } = {
  queued: t`Queued`,
  history: t`History`,
}

export function V2ProjectSafeDashboard() {
  const { projectOwnerAddress } = useContext(V2ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
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

  const [selectedTab, setSelectedTab] = useState<SafeTxCategory>(defaultTab)

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
        <div style={{ marginTop: '1.5rem' }}>
          <Tab
            name={TAB_NAMES['queued']}
            link={v2ProjectRoute({ projectId })}
            isSelected={selectedTab === 'queued'}
            onClick={() => setSelectedTab('queued')}
          />
          {selectedTab === 'queued' ? (
            <div style={{ marginTop: '1.5rem' }}>
              {queuedSafeTransactions?.map(
                (transaction: SafeTransactionType, idx: number) => (
                  <SafeTransaction
                    key={`safe-${transaction.nonce}-${idx}`}
                    transaction={transaction}
                  />
                ),
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
