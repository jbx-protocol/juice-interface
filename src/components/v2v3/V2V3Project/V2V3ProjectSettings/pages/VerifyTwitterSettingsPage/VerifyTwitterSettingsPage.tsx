import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import axios from 'axios'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
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
  const { projectId, projectMetadata, cv } = useContext(ProjectMetadataContext)
  const { colors } = useContext(ThemeContext).theme

  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const { signer } = useWallet()
  const { onOpen } = useTwitterAuth()
  const verification = useTwitterVerified()
  const isOwner = useIsUserAddress(projectOwnerAddress)

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
      emitErrorNotification(t`Twitter authentication failed.`)
      setIsAuthenticating(false)
    }
  }

  const disconnectRequest = async () => {
    if (!signer) return
    setIsDisconnecting(true)
    const message = t`Verify you own this project before disconnecting your Twitter account.`
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
      emitErrorNotification(t`Failed to disconnect Twitter account.`)
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
            This will open a window asking you to connect to Twitter.
          </Trans>
        </p>
        <p>
          <Trans>
            Project Twitter currently set to:{' '}
            <strong>@{projectMetadata?.twitter}</strong>
          </Trans>
        </p>
        <Button
          type="primary"
          onClick={initiateAuthRequest}
          loading={isAuthenticating}
        >
          <Trans>Verify Twitter handle</Trans>
        </Button>
      </>
    )
  }

  const verifiedState = () => {
    return (
      <>
        <h4>
          <Trans>Twitter connected</Trans>
        </h4>
        <p>
          <Trans>
            Your Twitter account is connected and currently set to:{' '}
            <strong>@{verification?.username}</strong>
          </Trans>
        </p>
        {isOwner ? (
          <Button
            loading={isDisconnecting}
            type="primary"
            onClick={disconnectRequest}
          >
            <Trans>Disconnect Twitter</Trans>
          </Button>
        ) : (
          <Button disabled type="primary">
            <Trans>Twitter connected</Trans>
          </Button>
        )}
      </>
    )
  }

  return verification ? verifiedState() : unverifiedState()
}
