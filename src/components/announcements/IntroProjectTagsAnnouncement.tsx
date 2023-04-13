import { Trans, t } from '@lingui/macro'
import { JuiceModalProps } from 'components/JuiceModal'
import { ProjectTagsRow } from 'components/ProjectTagsRow'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { NewFeatureAnnouncement } from './NewFeatureAnnouncement'

export const IntroProjectTagsAnnouncement = (
  props: Pick<JuiceModalProps, 'open' | 'setOpen'>,
) => {
  const router = useRouter()

  const onOk = useCallback(() => {
    router.push(router.asPath + '/settings?page=general')
  }, [router])

  return (
    <NewFeatureAnnouncement
      {...props}
      title={t`Project tags`}
      position="topRight"
      okText={t`Go to settings`}
      cancelText={t`Got it`}
      onOk={onOk}
    >
      <p className="mt-2">
        <Trans>
          You can now add tags in settings to describe your project, and help
          supporters find it. Anyone can search for projects by tag on the
          Explore page.
        </Trans>
      </p>
      <ProjectTagsRow />
    </NewFeatureAnnouncement>
  )
}
