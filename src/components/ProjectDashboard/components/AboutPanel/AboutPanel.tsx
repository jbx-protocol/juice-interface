import { Trans } from '@lingui/macro'
import { useAboutPanel } from 'components/ProjectDashboard/hooks/useAboutPanel'
import RichNote from 'components/RichNote/RichNote'
import { SocialLinkButton } from '../ui'

export const AboutPanel = () => {
  const { description } = useAboutPanel()
  return (
    <div className="flex min-h-[384px] flex-col gap-8 md:max-w-[596px]">
      <div className="flex flex-wrap gap-y-3 gap-x-10">
        <SocialLinkButton type="twitter" href="#" />
        <SocialLinkButton type="discord" href="#" />
        <SocialLinkButton type="telegram" href="#" />
        <SocialLinkButton type="website" href="#" />
      </div>
      {description ? (
        <RichNote note={description} />
      ) : (
        <div className="text-grey-500 dark:text-slate-200">
          <Trans>This project has no description.</Trans>
        </div>
      )}
    </div>
  )
}
