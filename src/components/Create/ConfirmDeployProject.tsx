import { Space, Statistic } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import PayoutModsList from 'components/shared/PayoutModsList'
import ProjectLogo from 'components/shared/ProjectLogo'
import TicketModsList from 'components/shared/TicketModsList'

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

import { getBallotStrategyByAddress } from 'constants/ballot-strategies'

export default function ConfirmDeployProject() {
  const editingFC = useEditingFundingCycleSelector()
  const editingProject = useAppSelector(state => state.editingProject.info)
  const { adminFeePercent } = useContext(UserContext)
  const { payoutMods, ticketMods } = useAppSelector(
    state => state.editingProject,
  )
  return (
    <Space size="large" direction="vertical">
      <h1 style={{ fontSize: '2rem' }}>Review project</h1>
      <ProjectLogo
        uri={editingProject?.metadata.logoUri}
        name={editingProject?.metadata.name}
      />
      <Space size="large">
        <Statistic
          title="Name"
          value={orEmpty(editingProject?.metadata.name)}
        />
        <Statistic
          title="Handle"
          value={'@' + orEmpty(editingProject?.handle)}
        />
        <Statistic
          title="Duration"
          value={
            editingFC.duration.gt(0)
              ? formattedNum(editingFC.duration)
              : 'Not set'
          }
          suffix={editingFC.duration.gt(0) ? 'days' : ''}
        />
      </Space>
      <Statistic
        title="Target"
        valueRender={() =>
          hasFundingTarget(editingFC) ? (
            editingFC.target.eq(0) ? (
              <span>
                Target is 0: All funds will be considered overflow and can be
                redeemed by burning project tokens.
              </span>
            ) : (
              <span>
                <CurrencySymbol
                  currency={editingFC?.currency.toNumber() as CurrencyOption}
                />
                {formatWad(editingFC?.target)}{' '}
                {editingFC.fee?.gt(0) && (
                  <span style={{ fontSize: '0.8rem' }}>
                    (
                    <CurrencySymbol
                      currency={
                        editingFC?.currency.toNumber() as CurrencyOption
                      }
                    />
                    {formatWad(amountSubFee(editingFC.target, adminFeePercent))}{' '}
                    after JBX fee)
                  </span>
                )}
              </span>
            )
          ) : (
            <span>
              No funding target: The project will control how all funds are
              distributed, and none can be redeemed by token holders.
            </span>
          )
        }
      />
      <Statistic
        title="Pay button"
        value={orEmpty(editingProject?.metadata.payButton)}
      />
      <Statistic
        title="Pay disclosure"
        value={orEmpty(editingProject?.metadata.payDisclosure)}
      />
      <Space size="large">
        <Statistic
          title="Payments paused"
          value={editingFC.payIsPaused ? 'Yes' : 'No'}
        />
        <Statistic
          title="Token printing"
          value={editingFC.ticketPrintingIsAllowed ? 'Allowed' : 'Disabled'}
        />
      </Space>
      <Space size="large">
        <Statistic
          title="Website"
          value={orEmpty(editingProject?.metadata.infoUri)}
        />
        <Statistic
          title="Twitter"
          value={
            editingProject?.metadata.twitter
              ? '@' + editingProject.metadata.twitter
              : orEmpty(undefined)
          }
        />
        <Statistic
          title="Discord"
          value={orEmpty(editingProject?.metadata.discord)}
        />
      </Space>
      <Space size="large" align="end">
        <Statistic
          title="Reserved tokens"
          value={fromPerbicent(editingFC?.reserved)}
          suffix="%"
        />
        {editingFC && isRecurring(editingFC) && (
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
            fee={adminFeePercent}
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
