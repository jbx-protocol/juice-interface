import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import useTwitterVerified, {
  TwitterVerificationInfo,
} from 'hooks/TwitterVerified'
import { useWallet } from 'hooks/Wallet'
import Link from 'next/link'
import { useContext } from 'react'
import { settingsPagePath } from 'utils/routes'

const TwitterVerified = () => {
  const { projectId, handle, projectOwnerAddress } =
    useContext(V2ProjectContext)
  const { userAddress } = useWallet()
  const [value] = useTwitterVerified('2-4653')
  const info = value as TwitterVerificationInfo
  const canVerify =
    projectOwnerAddress?.toLowerCase() === userAddress?.toLowerCase()

  const renderUnverifiedMessage = () => {
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
                Verify here
              </Link>
              .
            </Trans>
          </>
        )}
      </>
    )
  }
  return (
    <div>
      {info && info.verified ? (
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

export default TwitterVerified
