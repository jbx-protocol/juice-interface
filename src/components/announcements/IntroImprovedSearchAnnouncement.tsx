import { Trans, t } from '@lingui/macro'
import { JuiceModalProps } from 'components/JuiceModal'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { NewFeatureAnnouncement } from './NewFeatureAnnouncement'

export const IntroImprovedSearchAnnouncement = (
  props: Pick<JuiceModalProps, 'open' | 'setOpen'>,
) => {
  const router = useRouter()
  const onOk = useCallback(() => {
    router.push(router.asPath + '/settings?page=general')
  }, [router])

  return (
    <NewFeatureAnnouncement
      {...props}
      title={t`Improved search`}
      position="topRight"
      okText={t`Got it`}
      hideCancelButton
      onOk={onOk}
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
