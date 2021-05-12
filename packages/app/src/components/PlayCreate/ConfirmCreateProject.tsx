import { Space, Statistic } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { UserContext } from 'contexts/userContext'
import {
  useAppSelector,
  useEditingFundingCycleSelector,
} from 'hooks/AppSelector'
import { CurrencyOption } from 'models/currency-option'
import { useContext } from 'react'
import {
  formattedNum,
  formatWad,
  fromPerMille,
  fromWad,
} from 'utils/formatCurrency'
import { feeForAmount } from 'utils/math'
import { orEmpty } from 'utils/orEmpty'

export default function ConfirmCreateProject() {
  const { adminFeePercent } = useContext(UserContext)

  const editingFC = useEditingFundingCycleSelector()
  const editingProject = useAppSelector(
    state => state.editingProject.projectIdentifier,
  )

  const formattedTargetWithFee = () => {
    if (adminFeePercent === undefined) return

    const targetAmount = fromWad(editingFC?.target)

    if (targetAmount === undefined) return

    return (
      <span>
        <CurrencySymbol
          currency={editingFC?.currency.toString() as CurrencyOption}
        />
        {formattedNum(targetAmount)} (+
        {formatWad(feeForAmount(editingFC?.target, adminFeePercent))})
      </span>
    )
  }

  return (
    <Space size="large" direction="vertical">
      <h1 style={{ fontSize: '2rem' }}>Review your project</h1>
      <Space size="large">
        <Statistic title="Name" value={orEmpty(editingProject?.name)} />
        <Statistic
          title="Handle"
          value={'@' + orEmpty(editingProject?.handle)}
        />
      </Space>
      <Space size="large">
        <Statistic
          title="Duration"
          value={formattedNum(editingFC?.duration)}
          suffix="days"
        />
        <Statistic
          title="Amount (+5% admin fee)"
          valueRender={() => formattedTargetWithFee()}
        />
      </Space>
      <Statistic title="Link" value={orEmpty(editingProject?.link)} />
      <Space size="large" align="end">
        <Statistic
          title="Discount rate"
          value={fromPerMille(editingFC?.discountRate)}
          suffix="%"
        />
        <Statistic
          title="Reserved tickets"
          value={fromPerMille(editingFC?.reserved)}
          suffix="%"
        />
        <Statistic
          title="Bonding curve rate"
          value={fromPerMille(editingFC?.bondingCurveRate)}
          suffix="%"
        />
      </Space>
    </Space>
  )
}
