import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'

import useTwitterVerified from 'hooks/TwitterVerified'
import Link from 'next/link'
import { useContext, useMemo } from 'react'
import { settingsPagePath } from 'utils/routes'

const TwitterVerificationIcon = () => {
  const { handle, projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { projectId, projectMetadata } = useContext(ProjectMetadataContext)
  const verification = useTwitterVerified()
  const isVerified =
    verification &&
    projectMetadata?.twitter &&
    verification.username === projectMetadata.twitter

  const canVerify = useIsUserAddress(projectOwnerAddress)

  const renderUnverifiedMessage = useMemo(() => {
    return (
      <>
        <Trans>Twitter handle unverified.</Trans>
        {canVerify && (
          <>
            {' '}
            <Trans>
              <Link
                href={settingsPagePath('verifytwitter', { projectId, handle })}
              >
                Verify Twitter handle
              </Link>
              .
            </Trans>
          </>
        )}
      </>
    )
  }, [canVerify, handle, projectId])

  return (
    <div>
      {isVerified ? (
        <Tooltip title={t`Twitter Verified`} placement="right">
          <CheckCircleOutlined />
        </Tooltip>
      ) : (
        <Tooltip title={renderUnverifiedMessage} placement="right">
          <ExclamationCircleOutlined />
        </Tooltip>
      )}
    </div>
  )
}

export default TwitterVerificationIcon
