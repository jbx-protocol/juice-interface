import { Footer } from 'components/Footer'
import { PV } from 'models/pv'
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
    <div>
      <div
        className={`m-auto flex max-w-xl flex-col gap-8 ${CASE_STUDY_BODY_TEXT_COLOR} pt-8 pb-20 ${className}`}
      >
        {children}
      </div>
      <ReadMoreCaseStudies currentProject={currentProject} />
      <Footer />
    </div>
  )
}
