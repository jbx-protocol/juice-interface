import {
  CrownFilled,
  DeleteOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { Allocation } from 'components/Allocation'
import useMobile from 'hooks/Mobile'
import { PayoutsSelection } from 'models/payoutsSelection'
import { classNames } from 'utils/classNames'
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
  const isMobile = useMobile()

  return (
    <Allocation.Item
      title={
        <>
          <Trans>Project owner</Trans>{' '}
          <CrownFilled className="text-grey-400 dark:text-slate-200" />
        </>
      }
      amount={<Amount payoutsSelection={props.payoutsSelection} />}
      extra={
        props.canBeDeleted ? (
          <DeleteOutlined onClick={props.onDelete} />
        ) : (
          <Tooltip
            title={
              <Trans>
                You have configured for all funds to be distributed from the
                treasury. Your current payouts do not sum to 100%, so the
                remainder will go to the project owner.
              </Trans>
            }
          >
            <QuestionCircleOutlined
              className={classNames(isMobile ? 'text-lg' : 'text-sm')}
            />
          </Tooltip>
        )
      }
    />
  )
}
