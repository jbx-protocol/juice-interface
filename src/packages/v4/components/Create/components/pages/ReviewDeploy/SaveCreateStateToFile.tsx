import { CheckOutlined, DownloadOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import React, { useCallback, useState } from 'react'

import { Trans } from '@lingui/macro'
import { useSelector } from 'react-redux'
import { RootState } from 'redux/store'

export const SaveCreateStateToFile: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false)
  const creatingState = useSelector((state: RootState) => state.creatingV2Project)

  const handleSave = useCallback(() => {
    const blob = new Blob([JSON.stringify(creatingState, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${creatingState.projectMetadata?.name || 'draft'}.jb`
    link.click()

    URL.revokeObjectURL(url)
    
    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
    }, 2000)
  }, [creatingState])

  return (
    <Tooltip title={isSaved ? <Trans>Saved</Trans> : <Trans>Save draft to file</Trans>}>
      <Button 
        type="text"
        icon={isSaved ? <CheckOutlined /> : <DownloadOutlined />} 
        onClick={handleSave}
        aria-label={isSaved ? "Saved" : "Save draft to file"}
      />
    </Tooltip>
  )
}
