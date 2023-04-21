import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import SectionHeader from 'components/SectionHeader'
import Image from 'next/image'
import Link from 'next/link'
import { classNames } from 'utils/classNames'
import { formattedNum, parseWad } from 'utils/format/formatNumber'
import ETHAmount from '../currency/ETHAmount'
import {
  CaseStudiesConfiguration,
  CaseStudiesConfigurationProps,
} from './CaseStudiesConfiguration'

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
  const minorHeadingClasses = `text-sm uppercase ${CASE_STUDY_BODY_TEXT_COLOR}`
  const bigStatsContainer = 'flex flex-col items-start'
  const bigStats = 'text-4xl font-display'
  return (
    <div>
      <Image
        src={header}
        alt="header image"
        layout="responsive"
        width={1440}
        height={256}
      />
      <div className="m-auto max-w-xl">
        <h5 className={classNames(minorHeadingClasses, 'pt-10 pb-3')}>
          <Trans>Case study</Trans>
        </h5>
        <h2 className="font-heading text-4xl font-normal">{title}</h2>
        <p className={`${CASE_STUDY_BODY_TEXT_COLOR} text-base`}>{subtitle}</p>
        <div className="mt-1 flex gap-20">
          <div className={bigStatsContainer}>
            <h6 className={classNames(minorHeadingClasses, 'pt-4 pb-1')}>
              <Trans>Total raised</Trans>
            </h6>
            <div className={bigStats}>
              <ETHAmount amount={parseWad(totalRaised)} />
            </div>
          </div>
          <div className={bigStatsContainer}>
            <h6 className={classNames(minorHeadingClasses, 'pt-4 pb-1')}>
              <Trans>Total payments</Trans>
            </h6>
            <p className={bigStats}>{formattedNum(totalPayments)}</p>
          </div>
        </div>
        <SectionHeader className="mt-2" text={t`Summary`} />
        <p className={`mt-2 ${CASE_STUDY_BODY_TEXT_COLOR}`}>{summary}</p>
        <Link href={projectUrl}>
          <a>
            <Button size="middle" type="default" className="mt-2">
              <Trans>View project</Trans>
            </Button>
          </a>
        </Link>

        <SectionHeader className="mt-10 mb-6" text={t`Project configuration`} />
        <CaseStudiesConfiguration {...fundingConfig} />
      </div>
    </div>
  )
}
