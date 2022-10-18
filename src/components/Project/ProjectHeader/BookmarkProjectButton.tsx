import { StarOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import React from 'react'

const BookmarkProjectButton = () => {
  const bookmarkProject = () => {
    return
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
