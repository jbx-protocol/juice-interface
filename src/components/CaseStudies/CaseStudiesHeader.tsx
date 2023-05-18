import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import SectionHeader from 'components/SectionHeader'
import Link from 'next/link'
import { formattedNum, parseWad } from 'utils/format/formatNumber'
import ETHAmount from '../currency/ETHAmount'
import { BigStat } from './BigStat'
import {
  CaseStudiesConfiguration,
  CaseStudiesConfigurationProps,
} from './CaseStudiesConfiguration'
import { MinorHeading } from './MinorHeading'

interface CaseStudyHeaderProps {
  header: string
  title: string
  subtitle: string | JSX.Element
  totalRaised: number | string
  totalPayments: number
  summary: string | JSX.Element
  projectUrl: string
  fundingConfig: CaseStudiesConfigurationProps
}

export const CASE_STUDY_BODY_TEXT_COLOR = 'text-grey-700 dark:text-slate-200'

export function CaseStudiesHeader({
  header,
  title,
  subtitle,
  totalRaised,
  totalPayments,
  summary,
  projectUrl,
  fundingConfig,
}: CaseStudyHeaderProps) {
  return (
    <section>
      <div className="w-full">
        <img
          src={header}
          className="h-64 w-full object-cover"
          crossOrigin="anonymous"
          alt={`Cover image for ${title}`}
        />
      </div>
      <div className="m-auto max-w-prose px-4 text-base md:px-0">
        <MinorHeading className="pt-10 pb-3">
          <Trans>Case study</Trans>
        </MinorHeading>
        <h1 className="font-heading text-4xl font-normal">{title}</h1>
        <p className={CASE_STUDY_BODY_TEXT_COLOR}>{subtitle}</p>
        <div className="mt-1 flex gap-20 pb-12">
          <BigStat
            label={<Trans>Total raised</Trans>}
            value={<ETHAmount amount={parseWad(totalRaised)} />}
          />
          <BigStat
            label={<Trans>Total payments</Trans>}
            value={formattedNum(totalPayments) ?? '--'}
          />
        </div>
        <SectionHeader className="mt-2" text={<Trans>Summary</Trans>} />
        <p className={`mt-2 ${CASE_STUDY_BODY_TEXT_COLOR}`}>{summary}</p>
        <Link href={projectUrl}>
          <Button size="middle" type="default" className="mt-2">
            <Trans>View project</Trans>
          </Button>
        </Link>

        <SectionHeader
          className="mt-10 mb-6"
          text={<Trans>Project configuration</Trans>}
        />
        <CaseStudiesConfiguration {...fundingConfig} />
      </div>
    </section>
  )
}
