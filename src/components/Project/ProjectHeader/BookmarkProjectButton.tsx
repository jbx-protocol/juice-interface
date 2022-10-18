import { StarOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import axios from 'axios'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useWallet } from 'hooks/Wallet'
import { BookmarkProjectData } from 'pages/api/bookmark/index.page'
import React, { useContext } from 'react'

const BookmarkProjectButton = () => {
  const { userAddress } = useWallet()
  const { projectId, cv } = useContext(ProjectMetadataContext)

  const bookmarkProject = async () => {
    if (!userAddress || !projectId || !cv) {
      return
    }

    const data: BookmarkProjectData = {
      address: userAddress,
      projectId,
      cv,
    }

    try {
      await axios.post(`/api/bookmark`, data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Tooltip title={t`Bookmark Project`} placement="bottom">
      <Button
        onClick={() => bookmarkProject()}
        icon={<StarOutlined />}
        type="text"
      />
    </Tooltip>
  )
}

export default BookmarkProjectButton
