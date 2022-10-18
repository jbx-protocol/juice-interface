import { StarFilled, StarOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import axios from 'axios'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { useIsProjectBookmarked } from 'hooks/db/firebase/IsProjectBookmarked'
import { useWallet } from 'hooks/Wallet'
import { BookmarkProjectData } from 'pages/api/bookmark/index.page'
import React, { useContext } from 'react'
import { compositeProjectId } from 'utils/db/dbUtils'
import { emitErrorNotification } from 'utils/notifications'

const BookmarkProjectButton = () => {
  const { userAddress } = useWallet()
  const { projectId, cv } = useContext(ProjectMetadataContext)
  const [value, isLoading] = useIsProjectBookmarked()
  const isBookmarked = value && value[compositeProjectId(projectId!, cv!)]
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
      emitErrorNotification(t`Failed to bookmark project`)
    }
  }

  const unbokmarkProject = async () => {
    if (!userAddress || !projectId || !cv) {
      return
    }

    const data: BookmarkProjectData = {
      address: userAddress,
      projectId,
      cv,
      shouldUnbookmark: true,
    }

    try {
      await axios.post(`/api/bookmark`, data)
    } catch (error) {
      console.error(error)
      emitErrorNotification(t`Failed to unbookmark project`)
    }
  }

  return (
    <>
      {isLoading && <></>}
      {isBookmarked ? (
        <Tooltip title={t`Bookmarked`} placement="bottom">
          <Button
            onClick={unbokmarkProject}
            type="text"
            icon={<StarFilled style={{ color: colors.text.brand.primary }} />}
          />
        </Tooltip>
      ) : (
        <Tooltip title={t`Bookmark Project`} placement="bottom">
          <Button
            onClick={() => bookmarkProject()}
            icon={<StarOutlined />}
            type="text"
          />
        </Tooltip>
      )}
    </>
  )
}

export default BookmarkProjectButton
