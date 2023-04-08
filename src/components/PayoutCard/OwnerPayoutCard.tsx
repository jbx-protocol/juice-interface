import {
  CrownFilled,
  DeleteOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { Allocation } from 'components/Allocation'
import { PayoutsSelection } from 'models/payoutsSelection'
import { Amount } from './Amount'

type OwnerPayoutCardType =
  | {
      payoutsSelection: PayoutsSelection
      canBeDeleted?: false
    }
  | {
      payoutsSelection: PayoutsSelection
      canBeDeleted: true
      onDelete: VoidFunction
    }

export const OwnerPayoutCard: React.FC<OwnerPayoutCardType> = props => {
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
        props.canBeDeleted ? (
          <DeleteOutlined onClick={props.onDelete} />
        ) : (
          <Tooltip
            title={
              <Trans>
                This project is set to pay out all available ETH. Your payouts
                do not sum to 100%, so the remainder will go to the project
                owner.
              </Trans>
            }
          >
            <QuestionCircleOutlined className="text-lg md:text-sm" />
          </Tooltip>
        )
      }
    />
  )
}
