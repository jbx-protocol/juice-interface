import { Trans } from '@lingui/macro'
import { JuiceModalProps } from 'components/JuiceModal'
import { useWallet } from 'hooks/Wallet'
import { useWalletSignIn } from 'hooks/useWalletSignIn'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { Announcement } from './Announcement'

export const IntroProfileAnnouncement = (
  props: Pick<JuiceModalProps, 'open' | 'setOpen'>,
) => {
  const [loading, setLoading] = useState<boolean>(false)

  const wallet = useWallet()
  const signIn = useWalletSignIn()
  const router = useRouter()

  const onOk = useCallback(async () => {
    setLoading(true)
    try {
      await signIn()
      await router.push(`/account/${wallet.userAddress}/edit`)
    } catch (e) {
      console.error('Error occurred while signing in', e)
    } finally {
      setLoading(false)
    }
  }, [router, signIn, wallet.userAddress])

  return (
    <Announcement
      {...props}
      okLoading={loading}
      title={
        <span className="font-heading text-2xl font-bold">
          Complete your profile
        </span>
      }
      position="topRight"
      okText={<Trans>Edit profile</Trans>}
      cancelText={<Trans>Close</Trans>}
      onOk={onOk}
    >
      <p>
        <Trans>
          Complete your Juicebox profile to enjoy a personalized and seamless
          experience on our platform.
        </Trans>
      </p>
    </Announcement>
  )
}
