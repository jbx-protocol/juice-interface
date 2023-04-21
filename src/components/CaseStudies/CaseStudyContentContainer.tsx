import { Footer } from 'components/Footer'
import { PV } from 'models/pv'
import { classNames } from 'utils/classNames'
import { CASE_STUDY_BODY_TEXT_COLOR } from './CaseStudiesHeader'
import { ReadMoreCaseStudies } from './ReadMoreCaseStudies'

export function CaseStudyContentContainer({
  children,
  className,
  currentProject,
}: {
  children: React.ReactNode
  className?: string
  currentProject: {
    pv: PV
    id: number
  }
}) {
  return (
    <>
      <section
        className={classNames(
          `m-auto flex max-w-xl flex-col gap-8 pt-8 pb-20 text-base`,
          CASE_STUDY_BODY_TEXT_COLOR,
          className,
        )}
      >
        {children}
      </section>
      <section>
        <ReadMoreCaseStudies currentProject={currentProject} />
      </section>
      <Footer />
    </>
  )
}
