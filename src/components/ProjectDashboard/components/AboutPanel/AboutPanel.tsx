import { useAboutPanel } from 'components/ProjectDashboard/hooks/useAboutPanel'
import RichNote from 'components/RichNote/RichNote'
import { SocialLinkButton } from '../ui'

export const AboutPanel = () => {
  const { description } = useAboutPanel()
  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <div className="flex gap-10">
        <SocialLinkButton type="twitter" href="#" />
        <SocialLinkButton type="discord" href="#" />
        <SocialLinkButton type="telegram" href="#" />
        <SocialLinkButton type="website" href="#" />
      </div>
      <RichNote note={description} />
    </div>
  )
}
