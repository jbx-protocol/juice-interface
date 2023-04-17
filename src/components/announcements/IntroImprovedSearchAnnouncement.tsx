import { Trans, t } from '@lingui/macro'
import { JuiceModalProps } from 'components/JuiceModal'
import { NewFeatureAnnouncement } from './NewFeatureAnnouncement'

export const IntroImprovedSearchAnnouncement = (
  props: Pick<JuiceModalProps, 'open' | 'setOpen'>,
) => {
  return (
    <NewFeatureAnnouncement
      {...props}
      title={t`Improved search`}
      position="topRight"
      okText={t`Got it`}
      hideCancelButton
    >
      <p>
        <Trans>
          You can now search for projects by their name, description, and tags,
          as well as their @handle.
        </Trans>
      </p>
    </NewFeatureAnnouncement>
  )
}
