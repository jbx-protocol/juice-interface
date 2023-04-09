import { Trans, t } from '@lingui/macro'
import { JuiceModalProps } from 'components/JuiceModal'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Announcement } from './Announcement'

export const IntroProjectTagsAnnouncement = (
  props: Pick<JuiceModalProps, 'open' | 'setOpen'>,
) => {
  const router = useRouter()

  const onOk = useCallback(() => {
    router.push(router.asPath + '/settings?page=general')
  }, [router])

  return (
    <Announcement
      {...props}
      title={
        <span className="font-heading text-2xl font-bold">
          <Trans>Introducing project tags</Trans>
        </span>
      }
      position="topRight"
      okText={t`Go to settings`}
      cancelText={t`Got it`}
      onOk={onOk}
    >
      <p>
        <Trans>
          You can now add tags in{' '}
          <Link href="settings?page=general" as="settings?page=general">
            settings
          </Link>{' '}
          to describe your project, and help supporters find it. Anyone can
          search for projects by tag on the Explore page.
        </Trans>
      </p>
    </Announcement>
  )
}
