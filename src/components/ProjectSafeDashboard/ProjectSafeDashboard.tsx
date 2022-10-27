import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { Tab } from 'components/Tab'
import { layouts } from 'constants/styles/layouts'
import { ThemeContext } from 'contexts/themeContext'
import { useGnosisSafe } from 'hooks/GnosisSafe'
import { useQueuedSafeTransactions } from 'hooks/safe/QueuedSafeTransactions'
import { generateSafeUrl } from 'lib/safe'
import { SafeTransactionType } from 'models/safe'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CSSProperties, useContext } from 'react'
import { getUniqueNonces } from 'utils/safe'
import { BackToProjectButton } from '../BackToProjectButton'
import { ExecutedSafeTransactionsListing } from './ExecutedSafeTransactionsListing'
import { SafeNonceRow } from './SafeNonceRow'

export type SafeTxCategory = 'queued' | 'history'
const SAFE_TX_QUEUED_KEY: SafeTxCategory = 'queued'
const SAFE_TX_HISTORY_KEY: SafeTxCategory = 'history'

const DEFAULT_TAB: SafeTxCategory = SAFE_TX_QUEUED_KEY

const TAB_NAMES: { [k in SafeTxCategory]: string } = {
  queued: t`Queued`,
  history: t`History`,
}

export function ProjectSafeDashboard({
  projectPageUrl,
  projectOwnerAddress,
}: {
  projectPageUrl: string
  projectOwnerAddress: string
}) {
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

  // Returns unique nonces from tx list. Used to group tx's by nonce
  const uniqueNonces = getUniqueNonces(queuedSafeTransactions)

  const projectSafeRoute = `${projectPageUrl}/safe`

  const safeUrl = generateSafeUrl(projectOwnerAddress)

  return (
    <div style={containerStyle}>
      <h1 style={{ color: colors.text.primary, marginBottom: 5 }}>
        <Trans>Safe transactions</Trans>
      </h1>

      {!isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <ExternalLink href={safeUrl} style={{ textDecoration: 'underline' }}>
            <Trans>Go to your Safe</Trans>
          </ExternalLink>
          <BackToProjectButton projectPageUrl={projectPageUrl} />
        </div>
      ) : null}

      {isLoading && <div style={{ marginTop: 20 }}>Loading...</div>}

      {!isLoading && !uniqueNonces.length ? (
        <div>
          <Trans>This Safe has no queued transactions.</Trans>
        </div>
      ) : null}

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

          <div
            style={{
              marginTop: '1.5rem',
              borderTop:
                !isLoading && uniqueNonces.length
                  ? `1px solid ${colors.stroke.secondary}`
                  : 'unset',
            }}
          >
            {selectedTab === SAFE_TX_QUEUED_KEY ? (
              <>
                {uniqueNonces?.map((nonce: number, idx: number) => {
                  const transactionsOfNonce: SafeTransactionType[] =
                    queuedSafeTransactions.filter(
                      (tx: SafeTransactionType) => tx.nonce === nonce,
                    )

                  if (!transactionsOfNonce.length) return

                  return (
                    <SafeNonceRow
                      key={`safe-${nonce}-${idx}`}
                      nonce={nonce}
                      transactions={transactionsOfNonce}
                      safeThreshold={gnosisSafe?.threshold}
                      selectedTx={preSelectedTx}
                    />
                  )
                })}
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
