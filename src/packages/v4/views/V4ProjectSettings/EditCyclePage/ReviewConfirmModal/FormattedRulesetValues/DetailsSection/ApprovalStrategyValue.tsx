import { Tooltip } from 'antd'
import EtherscanLink from 'components/EtherscanLink'
import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import { BallotStrategy } from 'models/ballot'

export function ApprovalStrategyValue({
  approvalStrategy,
  warningText,
}: {
  approvalStrategy: BallotStrategy
  warningText: string | undefined
}) {
  return (
    <FundingCycleDetailWarning
      showWarning={Boolean(warningText)}
      tooltipTitle={warningText}
    >
      <Tooltip
        title={<EtherscanLink type="address" value={approvalStrategy.address} />}
      >
        <span className="underline decoration-smoke-500 decoration-dotted dark:decoration-slate-200">
          {approvalStrategy.name}
        </span>
      </Tooltip>
    </FundingCycleDetailWarning>
  )
}
