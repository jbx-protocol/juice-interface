import EthereumAddress from 'components/EthereumAddress'
import EtherscanLink from 'components/EtherscanLink'
import ProjectLogo from 'components/ProjectLogo'
import { JBChainId } from 'juice-sdk-react'
import { ChainLogo } from 'packages/v4v5/components/ChainLogo'
import { formatHistoricalDate } from 'utils/format/formatDate'

export interface ProtocolActivityElementEvent {
  id: string
  timestamp: number
  txHash: string
  chainId: number
  from: string
  projectId?: number
  projectName?: string | null
  projectHandle?: string | null
  projectLogoUri?: string | null
  projectToken?: string | null
  projectCurrency?: string | null
  projectDecimals?: number | null
}

export function ProtocolActivityElement({
  header,
  subject,
  event,
  projectName,
}: {
  header: string | JSX.Element
  subject: string | JSX.Element | null
  event: ProtocolActivityElementEvent | null | undefined
  projectName: string
}) {
  if (!event) return null

  const displayName = projectName || `Project #${event.projectId || '?'}`

  return (
    <div className="flex gap-3">
      {/* Project Logo - 48x48px */}
      <div className="flex-shrink-0">
        <ProjectLogo
          className="h-12 w-12"
          projectId={event.projectId}
          name={displayName}
          uri={event.projectLogoUri ?? undefined}
          pv={'5'}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Row 1: Project Name + Chain Icon */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="font-medium text-base truncate max-w-[180px]">
            {displayName}
          </div>
          <ChainLogo
            chainId={event.chainId as JBChainId}
            width={18}
            height={18}
          />
        </div>

        {/* Row 2: Action Label */}
        <div className="text-sm text-grey-600 dark:text-grey-400 capitalize mb-1">
          {header}
        </div>

        {/* Row 3: Amount */}
        <div className="font-heading text-lg whitespace-nowrap mb-1">
          {subject}
        </div>

        {/* Row 4: Timestamp + From Address */}
        <div className="flex items-center gap-2 text-xs text-grey-500 dark:text-grey-500">
          <span>{formatHistoricalDate(event.timestamp * 1000)}</span>
          <span>·</span>
          <EtherscanLink
            value={event.txHash}
            type="tx"
            className="text-grey-500 dark:text-grey-500"
            chainId={event.chainId as JBChainId}
          />
          <span>·</span>
          <EthereumAddress
            address={event.from}
            tooltipDisabled={false}
            linkDisabled
          />
        </div>
      </div>
    </div>
  )
}
