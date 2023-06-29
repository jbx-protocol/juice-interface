import { Trans, t } from '@lingui/macro'
import {
  SocialLink,
  useAboutPanel,
} from 'components/ProjectDashboard/hooks/useAboutPanel'
import RichNote from 'components/RichNote/RichNote'
import { EmptyScreen } from '../EmptyScreen'
import { SocialLinkButton } from '../ui'

export const AboutPanel = () => {
  const { description, socialLinks, projectName } = useAboutPanel()
  return (
    <div className="flex min-h-[384px] w-full flex-col gap-8 md:max-w-[596px] md:gap-10">
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
      <div className="flex flex-col gap-4">
        {description ? (
          <>
            <h3 className="mb-0 font-heading text-2xl font-medium">
              <Trans>About {projectName}</Trans>
            </h3>
            <RichNote className="mt-0 text-base" note={description} />
          </>
        ) : (
          <EmptyScreen subtitle={t`This project has no description`} />
        )}
      </div>
    </div>
  )
}
