import { Trans, t } from '@lingui/macro'
import { useProjectPageQueries } from 'components/ProjectDashboard/hooks/useProjectPageQueries'
import { JuiceModalProps } from 'components/modals/JuiceModal'
import { NewFeatureAnnouncement } from './NewFeatureAnnouncement'

/**
 * An example of a feature announcement.
 */
export const ProjectsUpdateFeatureAnnouncement = (
  props: Pick<JuiceModalProps, 'open' | 'setOpen'>,
) => {
  const { setProjectPageTab } = useProjectPageQueries()
  return (
    <NewFeatureAnnouncement
      {...props}
      title={t`Project updates 📢`}
      position="topRight"
      okText={t`Try it now`}
      onOk={() => setProjectPageTab('updates')}
      hideCancelButton
    >
      <p>
        <Trans>
          Keep contributors up to date by adding updates periodically to your
          project.
        </Trans>
      </p>
    </NewFeatureAnnouncement>
  )
}
