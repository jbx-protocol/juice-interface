import { Button, Tooltip } from 'antd'
import React, { useCallback, useRef } from 'react'

import { UploadOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'

export const LoadCreateStateFromFile: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileLoad = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string)
        if (data && typeof data === 'object') {
          const existing = localStorage.getItem('jb_redux_preloadedState')
          let parsed = existing ? JSON.parse(existing) : { reduxState: {} }
          parsed.reduxState = { ...parsed.reduxState, creatingV2Project: data }
          localStorage.setItem('jb_redux_preloadedState', JSON.stringify(parsed))
          window.location.reload()
        }
      } catch {
        // ignore invalid files
      }
    }
    reader.readAsText(file)
  }, [])

  return (
    <>
      <Tooltip title={<Trans>Load draft</Trans>}>
        <Button
          type="text"
          icon={<UploadOutlined />}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Load draft"
        />
      </Tooltip>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jb"
        style={{ display: 'none' }}
        onChange={handleFileLoad}
      />
    </>
  )
}
