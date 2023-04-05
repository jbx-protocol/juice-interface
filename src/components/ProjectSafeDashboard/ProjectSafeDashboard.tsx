import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Loading from 'components/Loading'
import { Tab } from 'components/Tab'
import { useGnosisSafe } from 'hooks/safe/GnosisSafe'
import { useQueuedSafeTransactions } from 'hooks/safe/QueuedSafeTransactions'
import { generateSafeUrl } from 'lib/safe'
import { SafeTransactionType } from 'models/safe'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { classNames } from 'utils/classNames'
import { getUniqueNonces } from 'utils/safe'
import { BackToProjectButton } from '../buttons/BackToProjectButton'
import { ExecutedSafeTransactionsListing } from './ExecutedSafeTransactionsListing'
import { SafeNonceRow } from './SafeNonceRow'

type SafeTxCategory = 'queued' | 'history'

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
  projectOwnerAddress?: string
}) {
  const router = useRouter()
  const { data: queuedSafeTransactions, isLoading: isTransactionsLoading } =
    useQueuedSafeTransactions({
      safeAddress: projectOwnerAddress,
    })
  const { data: gnosisSafe, isLoading: gnosisSafeLoading } =
    useGnosisSafe(projectOwnerAddress)

  const isLoading =
    isTransactionsLoading || gnosisSafeLoading || !projectOwnerAddress

  if (isLoading) return <Loading />

  if (!gnosisSafeLoading && !gnosisSafe) {
    return (
      <div className="my-8 mx-auto max-w-5xl p-5">
        <Trans>Project is not owned by a Safe.</Trans>
      </div>
    )
  }

  const url = new URL(router.asPath, process.env.NEXT_PUBLIC_BASE_URL)
  const preSelectedTx = url.hash.slice(1) as string
  if (preSelectedTx) {
    document
      .getElementById(preSelectedTx)
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  const selectedTab = (router.query.tab as SafeTxCategory) ?? DEFAULT_TAB

  // Returns unique nonces from tx list. Used to group tx's by nonce
  const uniqueNonces = getUniqueNonces(queuedSafeTransactions)

  const projectSafeRoute = `${projectPageUrl}/safe`

  const safeUrl = generateSafeUrl(projectOwnerAddress)

  return (
    <div className="my-8 mx-auto max-w-5xl p-5">
      <h1 className="mb-1 text-2xl text-black dark:text-slate-100">
        <Trans>Safe transactions</Trans>
      </h1>

      <div className="flex justify-between">
        <ExternalLink className="underline" href={safeUrl}>
          <Trans>Go to your Safe</Trans>
        </ExternalLink>
        <BackToProjectButton projectPageUrl={projectPageUrl} />
      </div>

      {!uniqueNonces.length ? (
        <div>
          <Trans>This Safe has no queued transactions.</Trans>
        </div>
      ) : null}

      {gnosisSafe && (
        <div className="mt-6">
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
            className={classNames(
              'mt-6',
              !isLoading && uniqueNonces.length
                ? 'border border-t border-r-0 border-b-0 border-l-0 border-solid border-grey-300 dark:border-slate-200'
                : '',
            )}
          >
            {selectedTab === SAFE_TX_QUEUED_KEY ? (
              <>
                {uniqueNonces?.map((nonce: number, idx: number) => {
                  const transactionsOfNonce = queuedSafeTransactions?.filter(
                    (tx: SafeTransactionType) => tx.nonce === nonce,
                  )

                  if (!transactionsOfNonce?.length) return null

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
