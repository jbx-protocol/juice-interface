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
      title="Example Feature"
      position="topRight"
      okText="Got it"
      hideCancelButton
    >
      <p>This is an example feature announcement.</p>
      <p>Use me as a base!</p>
    </NewFeatureAnnouncement>
  )
}
