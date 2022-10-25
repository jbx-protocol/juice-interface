import { CrownFilled, QuestionCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { PayoutsSelection } from 'models/payoutsSelection'
import { useContext } from 'react'
import { Allocation } from '../Allocation'
import { Amount } from './Amount'

export const OwnerPayoutCard = ({
  payoutsSelection,
}: {
  payoutsSelection: PayoutsSelection
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <Allocation.Item
      title={
        <>
          <Trans>Project owner</Trans>{' '}
          <CrownFilled style={{ color: colors.text.tertiary }} />
        </>
      }
      amount={<Amount payoutsSelection={payoutsSelection} />}
      extra={
        <Tooltip
          title={
            <Trans>
              You have configured for all funds to be distributed from the
              treasury. Your current payouts do not sum to 100%, so the
              remainder will go to the project owner.
            </Trans>
          }
        >
          <QuestionCircleOutlined />
        </Tooltip>
      }
    />
  )
}
