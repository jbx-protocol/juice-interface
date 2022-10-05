import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { Tab } from 'components/Tab'
import { layouts } from 'constants/styles/layouts'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useGnosisSafe } from 'hooks/GnosisSafe'
import { useQueuedSafeTransactions } from 'hooks/safe/QueuedSafeTransactions'
import { generateSafeUrl } from 'lib/safe'
import { SafeTransactionType } from 'models/safe'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CSSProperties, useContext } from 'react'
import { v2v3ProjectRoute } from 'utils/routes'
import { ExecutedSafeTransactionsListing } from './ExecutedSafeTransactionsListing'
import { SafeTransaction } from './SafeTransaction'

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

  const router = useRouter()
  const { data: queuedSafeTransactions, isLoading } = useQueuedSafeTransactions(
    {
      safeAddress: projectOwnerAddress,
    },
  )
  const { data: gnosisSafe, isLoading: gnosisSafeLoading } =
    useGnosisSafe(projectOwnerAddress)

  const url = new URL(router.asPath, process.env.NEXT_PUBLIC_BASE_URL)
  const preSelectedTx = url.hash.slice(1) as string
  if (preSelectedTx) {
    document
      .getElementById(preSelectedTx)
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  const selectedTab = (router.query.tab as SafeTxCategory) ?? DEFAULT_TAB

  const containerStyle: CSSProperties = {
    ...layouts.maxWidth,
    margin: '2rem auto',
  }

  if (!projectOwnerAddress) return null

  if (!gnosisSafeLoading && !gnosisSafe) {
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

      {!isLoading && gnosisSafe && (
        <div style={{ marginTop: '1.5rem' }}>
          <Space size="large">
            <Link href={`${projectSafeRoute}?tab=queued`}>
              <a>
                <Tab
                  name={TAB_NAMES.queued}
                  isSelected={selectedTab === SAFE_TX_QUEUED_KEY}
                />
              </a>
            </Link>
            <Link href={`${projectSafeRoute}?tab=history`}>
              <a>
                <Tab
                  name={TAB_NAMES.history}
                  isSelected={selectedTab === SAFE_TX_HISTORY_KEY}
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
                      transaction={{
                        ...transaction,
                        threshold: gnosisSafe?.threshold,
                      }}
                      selected={preSelectedTx === transaction.safeTxHash}
                    />
                  ),
                )}
              </>
            ) : selectedTab === SAFE_TX_HISTORY_KEY ? (
              <ExecutedSafeTransactionsListing
                safe={gnosisSafe}
                selectedTx={preSelectedTx}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
