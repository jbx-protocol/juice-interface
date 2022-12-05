import { ArrowRightOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import Input from 'antd/lib/input/Input'
import Modal from 'antd/lib/modal/Modal'
import { PV_V2 } from 'constants/pv'
import { ThemeContext } from 'contexts/themeContext'
import { useProjectsSearch } from 'hooks/Projects'
import { useRouter } from 'next/router'
import React, { useCallback, useContext, useEffect, useState } from 'react'

import Loading from './Loading'
import { ProjectVersionBadge } from './ProjectVersionBadge'
import V2V3ProjectHandleLink from './v2v3/shared/V2V3ProjectHandleLink'

const HOT_KEY = 'k'
const INPUT_ID = 'quickProjectSearch'
const MAX_RESULTS = 8
const PADDING = 10

export default function QuickProjectSearch() {
  const [searchText, setSearchText] = useState<string>()
  const [highlightIndex, setHighlightIndex] = useState<number>()
  const [spotlightActive, setSpotlightActive] = useState<boolean>()

  const router = useRouter()

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { data: searchPages, isLoading: isLoadingSearch } =
    useProjectsSearch(searchText)

  const search = useCallback(() => {
    if (highlightIndex === undefined) return

    const project = searchPages?.[highlightIndex]

    if (!project) return

    router.push(
      project.pv === PV_V2
        ? `/@${project.handle}`
        : `/p/id/${project.projectId}`,
    )
  }, [router, searchPages, highlightIndex])

  const reset = useCallback(() => {
    setSpotlightActive(false)
    setHighlightIndex(undefined)
    setSearchText(undefined)
  }, [])

  // Hot key listener
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.isComposing) return // i think right idk

      if (spotlightActive) {
        switch (e.key) {
          case 'escape':
            reset()
            break
          case 'Return':
          case 'Enter':
            search()
            reset()
            break
        }
      } else if (e.key === HOT_KEY && (e.metaKey || e.ctrlKey)) {
        setSpotlightActive(true)
        setTimeout(() => {
          // delay to wait for render when opening modal
          ;(
            document.getElementById(INPUT_ID) as HTMLInputElement | null
          )?.focus()
        }, 100)
      }
    }

    window.addEventListener('keypress', listener)

    return () => window.removeEventListener('keypress', listener)
  }, [spotlightActive, searchText, router, search, reset])

  // Arrow key up/down select listener
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (!searchPages || isLoadingSearch) return

      if (e.key === 'ArrowUp') {
        setHighlightIndex(i => (i === undefined ? 0 : Math.max(i - 1, 0)))
        e.stopPropagation()
      }
      if (e.key === 'ArrowDown') {
        setHighlightIndex(i => (i === undefined ? 0 : i + 1))
        e.stopPropagation()
      }
    }

    window.addEventListener('keyup', listener)

    return () => window.removeEventListener('keyup', listener)
  }, [
    spotlightActive,
    searchText,
    router,
    search,
    searchPages,
    isLoadingSearch,
  ])

  return (
    <Modal
      centered
      open={spotlightActive}
      onCancel={reset}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
      footer={null}
      closeIcon
      destroyOnClose
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: PADDING * 2,
        }}
      >
        <CloseCircleOutlined onClick={() => setSpotlightActive(false)} />
        <Input
          id={INPUT_ID}
          placeholder={t`Find a project`}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>
      {isLoadingSearch && <Loading />}
      {!!searchPages?.length && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            paddingTop: PADDING,
          }}
        >
          {searchPages.slice(0, MAX_RESULTS).map((p, i) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: PADDING,
                padding: PADDING,
                background:
                  highlightIndex === i
                    ? colors.background.l1
                    : colors.background.l0,
              }}
            >
              <V2V3ProjectHandleLink
                projectId={p.projectId}
                handle={p.handle}
              />
              <div style={{ flex: 1 }}>
                <ProjectVersionBadge
                  transparent
                  size="small"
                  versionText={`V${p.pv}`}
                />
              </div>
              <ArrowRightOutlined onClick={search} />
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
