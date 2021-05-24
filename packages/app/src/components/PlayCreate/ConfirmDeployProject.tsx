import { BigNumber } from '@ethersproject/bignumber'
import { Space, Statistic } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import {
  useAppSelector,
  useEditingFundingCycleSelector,
} from 'hooks/AppSelector'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import {
  formattedNum,
  formatWad,
  fromPerMille,
  fromWad,
} from 'utils/formatCurrency'
import { feeForAmount } from 'utils/math'
import { orEmpty } from 'utils/orEmpty'

import { isRecurring } from '../../utils/fundingCycle'

export default function ConfirmDeployProject() {
  const editingFC = useEditingFundingCycleSelector()
  const editingProject = useAppSelector(
    state => state.editingProject.projectIdentifier,
  )
  const adminFeePercent = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'fee',
  })

  const formattedTargetWithFee = () => {
    if (adminFeePercent === undefined) return

    const targetAmount = fromWad(editingFC?.target)

    if (targetAmount === undefined) return

    return (
      <span>
        <CurrencySymbol currency={editingFC?.currency} />
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
        {editingFC && isRecurring(editingFC) && (
          <Statistic
            title="Discount rate"
            value={fromPerMille(editingFC?.discountRate)}
            suffix="%"
          />
        )}
        <Statistic
          title="Reserved tickets"
          value={fromPerMille(editingFC?.reserved)}
          suffix="%"
        />
        {editingFC && isRecurring(editingFC) && (
          <Statistic
            title="Bonding curve rate"
            value={fromPerMille(editingFC?.bondingCurveRate)}
            suffix="%"
          />
        )}
      </Space>
    </Space>
  )
}
