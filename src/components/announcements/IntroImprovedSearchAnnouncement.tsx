import { t } from '@lingui/macro'
import { JuiceModalProps } from 'components/JuiceModal'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Announcement } from './Announcement'

export const IntroImprovedSearchAnnouncement = (
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
          Search just got cooler
        </span>
      }
      position="topRight"
      okText={t`Got it`}
      hideCancelButton
      onOk={onOk}
    >
      <p>
        Now you can search projects by their name, description, and tags, as
        well as their @handle.
      </p>
    </Announcement>
  )
}
