import { Trans } from '@lingui/macro'
import { JuiceModalProps } from 'components/modals/JuiceModal'
import { Announcement } from './Announcement'

export const NewFeatureAnnouncement: React.FC<
  React.PropsWithChildren<JuiceModalProps>
> = props => {
  return (
    <Announcement
      {...props}
      title={
        <>
          <div className="text-secondary mb-4 text-xs uppercase">
            <Trans>Introducing</Trans>
          </div>
          <div className="text-primary font-heading text-2xl">
            {props.title}
          </div>
        </>
      }
      position="topRight"
    >
      {props.children}
    </Announcement>
  )
}
