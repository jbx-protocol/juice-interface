import { t } from '@lingui/macro'
import { ConfigStat } from './ConfigStat'

export interface CaseStudiesConfigurationProps {
  cycleNumber: number
  cycles: string
  duration?: string
  payouts: string
  tokenName: string
  tokenIssuanceRate: string
  reservedRate: number
  issuanceReductionRate: number
  redemptionRate: number
  ownerTokenMinting: boolean
  editDeadline: string
}

export function CaseStudiesConfiguration({
  cycleNumber,
  cycles,
  duration,
  payouts,
  tokenName,
  tokenIssuanceRate,
  reservedRate,
  issuanceReductionRate,
  redemptionRate,
  ownerTokenMinting,
  editDeadline,
}: CaseStudiesConfigurationProps) {
  return (
    <div>
      <div className="mb-4 font-medium">{t`CYCLE #${cycleNumber}`}</div>
      <ConfigStat label={t`Cycles:`} stat={cycles} />
      {duration ? <ConfigStat label={t`Duration:`} stat={duration} /> : null}
      <ConfigStat label={t`Payouts:`} stat={payouts} />
      <ConfigStat
        label={t`Token issuance rate:`}
        stat={`${tokenIssuanceRate} ${tokenName}/ETH`}
      />
      <ConfigStat label={t`Reserved rate:`} stat={`${reservedRate}%`} />
      <ConfigStat
        label={t`Issuance reduction rate:`}
        stat={`${issuanceReductionRate}%`}
      />
      <ConfigStat label={t`Redemption rate:`} stat={`${redemptionRate}%`} />
      <ConfigStat
        label={t`Owner token minting:`}
        stat={ownerTokenMinting ? t`Enabled` : t`Disabled`}
      />
      <ConfigStat label={t`Edit deadline:`} stat={editDeadline} />
    </div>
  )
}
