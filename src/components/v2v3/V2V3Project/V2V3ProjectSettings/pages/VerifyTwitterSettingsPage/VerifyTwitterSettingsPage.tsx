import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import axios from 'axios'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useTwitterAuth } from 'hooks/SocialAuth'
import useTwitterVerified from 'hooks/TwitterVerified'
import { useWallet } from 'hooks/Wallet'
import { useContext, useState } from 'react'
import {
  emitErrorNotification,
  emitSuccessNotification,
} from 'utils/notifications'
import { verifyWallet } from 'utils/signature'

export const VerifyTwitterSettingsPage = () => {
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { signer, userAddress } = useWallet()
  const { projectId, projectMetadata, cv } = useContext(ProjectMetadataContext)
  const { onOpen } = useTwitterAuth()
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const { colors } = useContext(ThemeContext).theme
  const verification = useTwitterVerified()
  const isOwner =
    projectOwnerAddress?.toLowerCase() === userAddress?.toLowerCase()

  const initiateAuthRequest = async () => {
    if (!projectId || !projectMetadata?.twitter) return
    setIsAuthenticating(true)
    try {
      await axios.post(`/api/auth/twitter`, {
        projectId,
        cv,
      })
      onOpen()
    } catch (error) {
      emitErrorNotification(t`Something went wrong.`)
      setIsAuthenticating(false)
    }
  }

  const disconnectRequest = async () => {
    if (!signer) return
    setIsDisconnecting(true)
    const message = t`Verify you are the project owner in order to disconnect your Twitter account.`
    try {
      const signature = await verifyWallet(signer, message)
      await axios.post(`/api/auth/twitter/disconnect`, {
        projectOwnerAddress,
        message,
        signature,
        cv,
        projectId,
      })
      emitSuccessNotification(t`Twitter account disconnected.`)
    } catch (error) {
      console.error(error)
      emitErrorNotification(t`Something went wrong.`)
    }
    setIsDisconnecting(false)
  }

  const unverifiedState = () => {
    return (
      <>
        <h4>
          <Trans>Connect to Twitter to verify account ownership.</Trans>
        </h4>

        <p style={{ color: colors.text.primary }}>
          <Trans>
            This will pop a window allowing you to connect to Twitter and verify
            you are the owner of the project's Twitter account.
          </Trans>
        </p>
        <p>
          Project Twitter currently set to:{' '}
          <strong>@{projectMetadata?.twitter}</strong>
        </p>
        <Button
          type="primary"
          onClick={initiateAuthRequest}
          loading={isAuthenticating}
        >
          <Trans>Verify Twitter</Trans>
        </Button>
      </>
    )
  }

  const verifiedState = () => {
    return (
      <>
        <h4>
          <Trans>Twitter Already Connected</Trans>
        </h4>
        <p>
          Your Twitter account is connected and currently set to:{' '}
          <strong>@{verification?.username}</strong>
        </p>
        {isOwner ? (
          <Button
            loading={isDisconnecting}
            type="primary"
            onClick={disconnectRequest}
          >
            Disconnect Twitter
          </Button>
        ) : (
          <Button disabled type="primary">
            Twitter Connected
          </Button>
        )}
      </>
    )
  }

  return verification ? verifiedState() : unverifiedState()
}
