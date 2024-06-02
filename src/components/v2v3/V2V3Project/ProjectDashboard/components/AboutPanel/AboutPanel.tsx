import { t } from '@lingui/macro'
import { RichPreview } from 'components/RichPreview/RichPreview'
import { useAboutPanel } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useAboutPanel'
import { EmptyScreen } from '../EmptyScreen'

export const AboutPanel = () => {
  const { description } = useAboutPanel()
  return (
    <div className="flex min-h-[384px] w-full flex-col gap-8 md:gap-10">
      <div className="flex flex-col gap-4 whitespace-pre-wrap">
        {description ? (
          <RichPreview source={description} />
        ) : (
          <>
            <EmptyScreen subtitle={t`This project has no description`} />
          </>
        )}
      </div>
    </div>
  )
}
