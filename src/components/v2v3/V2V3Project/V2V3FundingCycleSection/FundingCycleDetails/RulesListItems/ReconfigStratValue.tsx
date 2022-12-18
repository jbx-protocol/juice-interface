import { Tooltip } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import { BallotStrategy } from 'models/ballot'

export function ReconfigStratValue({
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
      <Tooltip title={<FormattedAddress address={ballotStrategy.address} />}>
        <span className="underline">{ballotStrategy.name}</span>
      </Tooltip>
    </FundingCycleDetailWarning>
  )
}
