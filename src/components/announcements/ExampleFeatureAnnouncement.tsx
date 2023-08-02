import { Trans, t } from '@lingui/macro'
import { JuiceModalProps } from 'components/modals/JuiceModal'
import { NewFeatureAnnouncement } from './NewFeatureAnnouncement'

/**
 * An example of a feature announcement.
 */
export const ExampleFeatureAnnouncement = (
  props: Pick<JuiceModalProps, 'open' | 'setOpen'>,
) => {
  return (
    <NewFeatureAnnouncement
      {...props}
      title={t`Example Feature`}
      position="topRight"
      okText={t`Got it`}
      hideCancelButton
    >
      <p>
        <Trans>This is an example feature announcement.</Trans>
      </p>
      <p>
        <Trans>Use me as a base!</Trans>
      </p>
    </NewFeatureAnnouncement>
  )
}
