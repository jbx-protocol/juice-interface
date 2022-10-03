import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import axios from 'axios'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useTwitterAuth } from 'hooks/SocialAuth'
import { useContext, useState } from 'react'

export const VerifyTwitterSettingsPage = () => {
  const { projectId, projectMetadata } = useContext(ProjectMetadataContext)
  const { onOpen } = useTwitterAuth()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const initiateAuthRequest = async () => {
    if (!projectId || !projectMetadata?.twitter) return
    setIsAuthenticating(true)
    await axios.post(`/api/auth/twitter`, {
      projectId,
      twitterUsername: projectMetadata.twitter,
    })
    onOpen()
  }

  return (
    <div>
      <p>
        <Trans>Verify your project owns the linked Twitter account.</Trans>
      </p>
      <Button
        type="primary"
        onClick={initiateAuthRequest}
        loading={isAuthenticating}
      >
        <Trans>Verify Twitter</Trans>
      </Button>
    </div>
  )
}
