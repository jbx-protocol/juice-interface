import { useAboutPanel } from 'components/ProjectDashboard/hooks/useAboutPanel'
import RichNote from 'components/RichNote/RichNote'
import { SocialLinkButton } from '../ui'

export const AboutPanel = () => {
  const { description } = useAboutPanel()
  return (
    <div className="flex flex-col gap-8 md:max-w-4xl">
      <div className="flex flex-wrap gap-y-3 gap-x-10">
        <SocialLinkButton type="twitter" href="#" />
        <SocialLinkButton type="discord" href="#" />
        <SocialLinkButton type="telegram" href="#" />
        <SocialLinkButton type="website" href="#" />
      </div>
      <RichNote note={description} />
    </div>
  )
}
