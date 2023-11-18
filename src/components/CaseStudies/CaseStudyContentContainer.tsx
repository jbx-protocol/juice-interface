import { Footer } from 'components/Footer/Footer'
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
  currentProject: string
}) {
  return (
    <>
      <section
        className={classNames(
          `m-auto flex max-w-prose flex-col gap-8 px-4 pt-8 pb-20 text-base md:px-0`,
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
