import { ArrowRightOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import Input from 'antd/lib/input/Input'
import Modal from 'antd/lib/modal/Modal'
import { PV_V2 } from 'constants/pv'
import { useProjectsSearch } from 'hooks/Projects'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import Loading from './Loading'
import { ProjectVersionBadge } from './ProjectVersionBadge'
import V1ProjectHandle from './v1/shared/V1ProjectHandle'
import V2V3ProjectHandleLink from './v2v3/shared/V2V3ProjectHandleLink'

const HOT_KEY = 'k'
const INPUT_ID = 'quickProjectSearch'
const MAX_RESULTS = 8

export default function QuickProjectSearch() {
  const [searchText, setSearchText] = useState<string>()
  const [highlightIndex, setHighlightIndex] = useState<number>()
  const [spotlightActive, setSpotlightActive] = useState<boolean>()

  const router = useRouter()

  const { data: searchPages, isLoading: isLoadingSearch } =
    useProjectsSearch(searchText)

  const goToProject = useCallback(() => {
    if (highlightIndex === undefined) return

    const project = searchPages?.[highlightIndex]

    if (!project) return

    router.push(
      project.pv === PV_V2 ? `/@${project.handle}` : `/p/${project.projectId}`,
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
            goToProject()
            reset()
            break
        }
      } else if (e.key === HOT_KEY && (e.metaKey || e.ctrlKey)) {
        setSpotlightActive(true)
        setTimeout(
          () =>
            // delay to wait for render when opening modal
            (
              document.getElementById(INPUT_ID) as HTMLInputElement | null
            )?.focus(),
          100,
        )
      }
    }

    window.addEventListener('keypress', listener)

    return () => window.removeEventListener('keypress', listener)
  }, [spotlightActive, searchText, router, goToProject, reset])

  // Arrow key up/down / tab listener
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (!searchPages || isLoadingSearch) return

      switch (e.key) {
        case 'ArrowUp':
          setHighlightIndex(i => (i === undefined ? 0 : Math.max(i - 1, 0)))
          break
        case 'ArrowDown':
        case 'Tab':
          setHighlightIndex(i =>
            i === undefined ? 0 : Math.min(i + 1, searchPages.length - 1),
          )
          break
      }

      e.stopPropagation()
    }

    window.addEventListener('keyup', listener)

    return () => window.removeEventListener('keyup', listener)
  }, [
    spotlightActive,
    searchText,
    router,
    goToProject,
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
      bodyStyle={{ padding: 0 }}
    >
      <div className="flex items-center gap-5 p-5">
        <CloseCircleOutlined onClick={() => setSpotlightActive(false)} />
        <Input
          id={INPUT_ID}
          placeholder={t`Find a project`}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>
      {isLoadingSearch && <Loading />}
      {!!searchPages?.length && (
        <div className="flex flex-col pb-5">
          {searchPages.slice(0, MAX_RESULTS).map((p, i) => (
            <div
              key={p.id}
              className={twMerge(
                'flex cursor-pointer items-baseline gap-2 py-2 px-5',
                highlightIndex === i ? 'bg-slate-600' : '',
              )}
              onClick={goToProject}
              onMouseEnter={() => setHighlightIndex(i)}
            >
              {p.pv === PV_V2 ? (
                <V2V3ProjectHandleLink
                  projectId={p.projectId}
                  handle={p.handle}
                />
              ) : (
                <V1ProjectHandle projectId={p.projectId} handle={p.handle} />
              )}

              <div style={{ flex: 1 }}>
                <ProjectVersionBadge
                  transparent
                  size="small"
                  versionText={`V${p.pv}`}
                />
              </div>

              {highlightIndex === i && <ArrowRightOutlined />}
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
