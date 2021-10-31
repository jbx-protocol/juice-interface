import { Space, Statistic } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import PayoutModsList from 'components/shared/PayoutModsList'
import TicketModsList from 'components/shared/TicketModsList'
import { getBallotStrategyByAddress } from 'constants/ballot-strategies'
import {
  useAppSelector,
  useEditingFundingCycleSelector,
} from 'hooks/AppSelector'
import { CurrencyOption } from 'models/currency-option'
import {
  formattedNum,
  formatWad,
  fromPerbicent,
  fromPermille,
} from 'utils/formatNumber'
import { hasFundingTarget, isRecurring } from 'utils/fundingCycle'
import { amountSubFee } from 'utils/math'
import { orEmpty } from 'utils/orEmpty'

export default function ConfirmDeployProject() {
  const editingFC = useEditingFundingCycleSelector()
  const editingProject = useAppSelector(state => state.editingProject.info)
  const { payoutMods, ticketMods } = useAppSelector(
    state => state.editingProject,
  )
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
          value={
            editingFC.duration.gt(0)
              ? formattedNum(editingFC.duration)
              : 'Not set'
          }
          suffix={editingFC.duration.gt(0) ? 'days' : ''}
        />
        {hasFundingTarget(editingFC) && (
          <Statistic
            title="Amount"
            valueRender={() => (
              <span>
                <CurrencySymbol
                  currency={editingFC?.currency.toNumber() as CurrencyOption}
                />
                {formatWad(editingFC?.target)}{' '}
                <span style={{ fontSize: '0.8rem' }}>
                  (
                  <CurrencySymbol
                    currency={editingFC?.currency.toNumber() as CurrencyOption}
                  />
                  {formatWad(amountSubFee(editingFC.target, editingFC.fee))}{' '}
                  after JBX fee)
                </span>
              </span>
            )}
          />
        )}
      </Space>
      <Statistic
        title="Link"
        value={orEmpty(editingProject?.metadata.infoUri)}
      />
      <Space size="large" align="end">
        <Statistic
          title="Reserved tokens"
          value={fromPerbicent(editingFC?.reserved)}
          suffix="%"
        />
        {editingFC && isRecurring(editingFC) && hasFundingTarget(editingFC) && (
          <Statistic
            title="Discount rate"
            value={fromPermille(editingFC?.discountRate)}
            suffix="%"
          />
        )}
        {editingFC && isRecurring(editingFC) && hasFundingTarget(editingFC) && (
          <Statistic
            title="Bonding curve rate"
            value={fromPerbicent(editingFC?.bondingCurveRate)}
            suffix="%"
          />
        )}
      </Space>
      <Statistic
        title="Reconfiguration strategy"
        valueRender={() => {
          const ballot = getBallotStrategyByAddress(editingFC.ballot)
          return (
            <div>
              {ballot.name}{' '}
              <div style={{ fontSize: '0.7rem' }}>{ballot.address}</div>
            </div>
          )
        }}
      />
      <Statistic
        title="Spending"
        valueRender={() => (
          <PayoutModsList
            mods={payoutMods}
            projectId={undefined}
            fundingCycle={editingFC}
          />
        )}
      />
      <Statistic
        title="Reserved token allocations"
        valueRender={() => (
          <TicketModsList
            mods={ticketMods}
            projectId={undefined}
            fundingCycle={undefined}
          />
        )}
      />
    </Space>
  )
}
