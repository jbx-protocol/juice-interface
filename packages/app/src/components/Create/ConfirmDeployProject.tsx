import { BigNumber } from '@ethersproject/bignumber'
import { Space, Statistic } from 'antd'
import Mods from 'components/Dashboard/Mods'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import {
  useAppSelector,
  useEditingFundingCycleSelector,
} from 'hooks/AppSelector'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { CurrencyOption } from 'models/currency-option'
import {
  formattedNum,
  formatWad,
  fromPerbicent,
  fromWad,
} from 'utils/formatNumber'
import { isRecurring } from 'utils/fundingCycle'
import { feeForAmount } from 'utils/math'
import { orEmpty } from 'utils/orEmpty'

export default function ConfirmDeployProject() {
  const editingFC = useEditingFundingCycleSelector()
  const editingProject = useAppSelector(state => state.editingProject.info)
  const { paymentMods, ticketMods } = useAppSelector(
    state => state.editingProject,
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
        <CurrencySymbol
          currency={editingFC?.currency.toNumber() as CurrencyOption}
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
        <Statistic
          title="Name"
          value={orEmpty(editingProject?.metadata.name)}
        />
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
      <Statistic
        title="Link"
        value={orEmpty(editingProject?.metadata.infoUri)}
      />
      <Space size="large" align="end">
        {editingFC && isRecurring(editingFC) && (
          <Statistic
            title="Discount rate"
            value={fromPerbicent(editingFC?.discountRate)}
            suffix="%"
          />
        )}
        <Statistic
          title="Reserved tokens"
          value={fromPerbicent(editingFC?.reserved)}
          suffix="%"
        />
        {editingFC && isRecurring(editingFC) && (
          <Statistic
            title="Bonding curve rate"
            value={fromPerbicent(editingFC?.bondingCurveRate)}
            suffix="%"
          />
        )}
      </Space>
      <Statistic
        title="Auto payouts"
        valueRender={() => (
          <Mods
            mods={paymentMods}
            projectId={undefined}
            fundingCycle={undefined}
            isOwner={true}
            emptyText="No payouts set"
          />
        )}
      />
      <Statistic
        title="Reserved token allocations"
        valueRender={() => (
          <Mods
            mods={ticketMods}
            projectId={undefined}
            fundingCycle={undefined}
            isOwner={true}
            emptyText="No allocations set"
          />
        )}
      />
    </Space>
  )
}
