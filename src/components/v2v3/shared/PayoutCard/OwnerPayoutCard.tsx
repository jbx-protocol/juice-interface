import { CrownFilled, QuestionCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { Allocation } from 'components/v2v3/shared/Allocation/Allocation'
import { PayoutsSelection } from 'models/payoutsSelection'
import { Amount } from './Amount'

type OwnerPayoutCardProps = {
  payoutsSelection: PayoutsSelection
}

export const OwnerPayoutCard: React.FC<
  React.PropsWithChildren<OwnerPayoutCardProps>
> = props => {
  return (
    <Allocation.Item
      title={
        <span className="flex items-center gap-2">
          <Trans>Project owner</Trans>{' '}
          <CrownFilled className="text-grey-400 dark:text-slate-200" />
        </span>
      }
      amount={<Amount payoutsSelection={props.payoutsSelection} />}
      extra={
        <Tooltip
          title={
            <Trans>
              Your payouts do not sum to 100%. Because your project is set to
              pay out all available ETH, the remainder will go to the project
              owner.
            </Trans>
          }
        >
          <QuestionCircleOutlined className="mr-2 text-lg md:text-sm" />
        </Tooltip>
      }
    />
  )
}
