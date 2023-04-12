import { CheckIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { JuiceModalProps } from 'components/JuiceModal'
import { useWallet } from 'hooks/Wallet'
import { useWalletSignIn } from 'hooks/WalletSignIn'
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
      okText={
        <span className="flex gap-2">
          <CheckIcon className="h-4 w-4" />
          <Trans>Go to profile</Trans>
        </span>
      }
      hideCancelButton
      onOk={onOk}
    >
      <p>
        <Trans>
          Consider completing your profile to enjoy a personalized and seamless
          experience on our platform.
        </Trans>
      </p>
    </Announcement>
  )
}
