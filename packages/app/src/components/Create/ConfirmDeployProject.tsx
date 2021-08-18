import { Space, Statistic } from 'antd'
import PayoutModsList from 'components/Dashboard/PayoutModsList'
import TicketModsList from 'components/Dashboard/TicketModsList'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { getBallotStrategyByAddress } from 'constants/ballot-strategies'
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
  const { adminFeePercent } = useContext(UserContext)

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
      {hasFundingTarget(editingFC) && (
        <Space size="large">
          <Statistic
            title="Duration"
            value={formattedNum(editingFC?.duration)}
            suffix="days"
          />
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
                  {formatWad(amountSubFee(editingFC?.target, adminFeePercent))}{' '}
                  after JBX fee)
                </span>
              </span>
            )}
          />
        </Space>
      )}
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
            isOwner={true}
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
            isOwner={true}
          />
        )}
      />
    </Space>
  )
}
