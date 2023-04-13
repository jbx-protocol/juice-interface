import { Tooltip } from 'antd'
import EtherscanLink from 'components/EtherscanLink'
import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import { BallotStrategy } from 'models/ballot'

export function BallotStrategyValue({
  ballotStrategy,
  warningText,
}: {
  ballotStrategy: BallotStrategy
  warningText: string | undefined
}) {
  return (
    <FundingCycleDetailWarning
      showWarning={Boolean(warningText)}
      tooltipTitle={warningText}
    >
      <Tooltip
        title={<EtherscanLink type="address" value={ballotStrategy.address} />}
      >
        <span className="underline decoration-dashed">
          {ballotStrategy.name}
        </span>
      </Tooltip>
    </FundingCycleDetailWarning>
  )
}
