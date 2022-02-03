import { t, Trans } from '@lingui/macro'
import { Space, Statistic } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import PayoutModsList from 'components/shared/PayoutModsList'
import ProjectLogo from 'components/shared/ProjectLogo'
import TicketModsList from 'components/shared/TicketModsList'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import {
  useAppSelector,
  useEditingFundingCycleSelector,
} from 'hooks/AppSelector'
import { useTerminalFee } from 'hooks/TerminalFee'
import { CurrencyOption } from 'models/currency-option'
import { useContext } from 'react'
import {
  formattedNum,
  formatWad,
  fromPerbicent,
  fromPermille,
} from 'utils/formatNumber'
import {
  hasFundingDuration,
  hasFundingTarget,
  isRecurring,
} from 'utils/fundingCycle'
import { amountSubFee } from 'utils/math'
import { orEmpty } from 'utils/orEmpty'

import { getBallotStrategyByAddress } from 'constants/ballotStrategies/getBallotStrategiesByAddress'

export default function ConfirmDeployProject() {
  const editingFC = useEditingFundingCycleSelector()
  const editingProject = useAppSelector(state => state.editingProject.info)
  const { terminal } = useContext(V1ProjectContext)
  const { payoutMods, ticketMods } = useAppSelector(
    state => state.editingProject,
  )
  const terminalFee = useTerminalFee(terminal?.version)

  return (
    <Space size="large" direction="vertical">
      <h1 style={{ fontSize: '2rem' }}>
        <Trans>Review project</Trans>
      </h1>
      <ProjectLogo
        uri={editingProject?.metadata.logoUri}
        name={editingProject?.metadata.name}
      />
      <Space size="large">
        <Statistic
          title={t`Name`}
          value={orEmpty(editingProject?.metadata.name)}
        />
        <Statistic
          title={t`Handle`}
          value={t`@` + orEmpty(editingProject?.handle)}
        />
        <Statistic
          title={t`Duration`}
          value={
            editingFC.duration.gt(0)
              ? formattedNum(editingFC.duration)
              : t`Not set`
          }
          suffix={editingFC.duration.gt(0) ? t`days` : ''}
        />
      </Space>
      <Statistic
        title={t`Target`}
        valueRender={() =>
          hasFundingTarget(editingFC) ? (
            editingFC.target.eq(0) ? (
              <span>
                <Trans>
                  Target is 0: All funds will be considered overflow and can be
                  redeemed by burning project tokens.
                </Trans>
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
                    <Trans>
                      {formatWad(amountSubFee(editingFC.target, terminalFee), {
                        precision: 4,
                      })}{' '}
                      after JBX fee
                    </Trans>
                    )
                  </span>
                )}
              </span>
            )
          ) : (
            <span>
              <Trans>
                No funding target: The project will control how all funds are
                distributed, and none can be redeemed by token holders.
              </Trans>
            </span>
          )
        }
      />
      <Statistic
        title={t`Pay button`}
        value={editingProject?.metadata.payButton ?? t`Pay`}
      />
      <Statistic
        title={t`Pay disclosure`}
        value={orEmpty(editingProject?.metadata.payDisclosure)}
      />
      <Space size="large">
        <Statistic
          title={t`Payments paused`}
          value={editingFC.payIsPaused ? 'Yes' : 'No'}
        />
        <Statistic
          title={t`Token minting`}
          value={editingFC.ticketPrintingIsAllowed ? t`Allowed` : t`Disabled`}
        />
      </Space>
      <Space size="large">
        <Statistic
          title={t`Website`}
          value={orEmpty(editingProject?.metadata.infoUri)}
        />
        <Statistic
          title={t`Twitter`}
          value={
            editingProject?.metadata.twitter
              ? '@' + editingProject.metadata.twitter
              : orEmpty(undefined)
          }
        />
        <Statistic
          title={t`Discord`}
          value={orEmpty(editingProject?.metadata.discord)}
        />
      </Space>
      <Space size="large" align="end">
        <Statistic
          title={t`Reserved tokens`}
          value={fromPerbicent(editingFC?.reserved)}
          suffix="%"
        />
        {editingFC && isRecurring(editingFC) && (
          <Statistic
            title={t`Discount rate`}
            value={fromPermille(editingFC?.discountRate)}
            suffix="%"
          />
        )}
        {editingFC && isRecurring(editingFC) && hasFundingTarget(editingFC) && (
          <Statistic
            title={t`Bonding curve rate`}
            value={fromPerbicent(editingFC?.bondingCurveRate)}
            suffix="%"
          />
        )}
      </Space>
      {editingFC.duration.gt(0) && (
        <Statistic
          title={t`Reconfiguration strategy`}
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
      )}
      <Statistic
        title={t`Spending`}
        valueRender={() => (
          <PayoutModsList
            mods={payoutMods}
            projectId={undefined}
            fundingCycle={editingFC}
            fee={terminalFee}
          />
        )}
      />
      <Statistic
        title={t`Reserved token allocations`}
        valueRender={() => (
          <TicketModsList
            mods={ticketMods}
            projectId={undefined}
            fundingCycle={undefined}
            reservedRate={parseFloat(fromPerbicent(editingFC?.reserved))}
          />
        )}
      />
      {hasFundingDuration(editingFC) ? (
        <p>
          <Trans>
            <strong>Note:</strong> Funding cycle properties will{' '}
            <strong>not</strong> be editable immediately within a funding cycle.
            They can only be changed for <strong>upcoming</strong> funding
            cycles.
          </Trans>
        </p>
      ) : null}
    </Space>
  )
}
