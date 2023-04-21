import { CASE_STUDY_BODY_TEXT_COLOR } from './CaseStudiesHeader'

interface ConfigStatProps {
  label: string | JSX.Element
  stat: string | JSX.Element
}

export function ConfigStat({ label, stat }: ConfigStatProps) {
  return (
    <div className="mb-4 flex gap-5">
      <div className={CASE_STUDY_BODY_TEXT_COLOR}>{label}</div>
      <div className="font-medium">{stat}</div>
    </div>
  )
}
