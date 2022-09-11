import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import axios from 'axios'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useTwitterAuth } from 'hooks/socialAuth'
import { useContext, useState } from 'react'

const VerifyTwitter = () => {
  const { projectId, projectMetadata } = useContext(V2ProjectContext)
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

export default VerifyTwitter
