import { t } from '@lingui/macro'
import { CaseStudiesConfigurationProps } from 'components/CaseStudies/CaseStudiesConfiguration'
import { PV_V1, PV_V2 } from 'constants/pv'
import { ProjectTagName } from 'models/project-tags'
import { PV } from 'models/pv'

export const CASE_STUDY_PROJECTS: {
  pv: PV
  id: number
  tags: ProjectTagName[]
  nameOverride?: string
  imageOverride?: string
}[] = [
  {
    pv: PV_V1,
    id: 36, // cdao
    tags: ['fundraising', 'dao'],
    imageOverride: '/assets/images/case-studies/cdao.webp',
  },
  {
    pv: PV_V1,
    id: 199, // moondao
    tags: ['fundraising', 'dao'],
  },
  {
    pv: PV_V1,
    id: 7, // sharkdao
    tags: ['dao'],
  },
  {
    pv: PV_V2,
    id: 311, // studiodao
    tags: ['nfts', 'dao'],
    nameOverride: 'StudioDAO',
  },
]

export const CONSTITUTION_FUNDING_CONFIG: CaseStudiesConfigurationProps = {
  cycleNumber: 1,
  cycles: t`Unlocked`,
  payouts: t`Unlimited`,
  tokenName: 'PEOPLE',
  tokenIssuanceRate: '1,000,000',
  reservedRate: 0,
  issuanceReductionRate: 0,
  redemptionRate: 100,
  ownerTokenMinting: false,
  editDeadline: t`No deadline`,
}

export const MOONDAO_FUNDING_CONFIG: CaseStudiesConfigurationProps = {
  cycleNumber: 1,
  cycles: t`Locked`,
  duration: t`30 days`,
  payouts: t`Unlimited`,
  tokenName: 'MOONEY',
  tokenIssuanceRate: '500,000 (+ 500,000 reserved)',
  reservedRate: 50,
  issuanceReductionRate: 0,
  redemptionRate: 100,
  ownerTokenMinting: false,
  editDeadline: t`No deadline`,
}

export const SHARKDAO_FUNDING_CONFIG: CaseStudiesConfigurationProps = {
  cycleNumber: 1,
  cycles: t`Unlocked`,
  payouts: t`Limited (1,050 ETH)`,
  tokenName: 'SHARK',
  tokenIssuanceRate: '1,000,000',
  reservedRate: 0,
  issuanceReductionRate: 0,
  redemptionRate: 100,
  ownerTokenMinting: false,
  editDeadline: t`No deadline`,
}

export const STUDIODAO_FUNDING_CONFIG: CaseStudiesConfigurationProps = {
  cycleNumber: 1,
  cycles: t`Locked (28 days)`,
  duration: t`30 days`,
  payouts: t`Limited (100 ETH)`,
  tokenName: 'STUDIO',
  tokenIssuanceRate: '800,000 (+ 200,000 reserved)',
  reservedRate: 20,
  issuanceReductionRate: 5,
  redemptionRate: 100,
  ownerTokenMinting: false,
  editDeadline: t`3-day deadline`,
}
