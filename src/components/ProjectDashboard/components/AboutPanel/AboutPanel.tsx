import { Trans } from '@lingui/macro'
import {
  SocialLink,
  useAboutPanel,
} from 'components/ProjectDashboard/hooks/useAboutPanel'
import RichNote from 'components/RichNote/RichNote'
import { SocialLinkButton } from '../ui'

export const AboutPanel = () => {
  const { description, socialLinks } = useAboutPanel()
  return (
    <div className="flex min-h-[384px] flex-col gap-8 md:max-w-[596px]">
      <div className="flex flex-wrap gap-y-3 gap-x-10">
        {Object.entries(socialLinks)
          .filter(([, href]) => !!href)
          .map(([type, href]) => (
            <SocialLinkButton
              key={type}
              type={type as SocialLink}
              href={href ?? ''}
            />
          ))}
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
