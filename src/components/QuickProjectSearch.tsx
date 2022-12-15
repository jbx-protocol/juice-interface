import { ArrowRightOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
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
const DEBOUNCE_MILLIS = 250

export default function QuickProjectSearch() {
  const [inputText, setInputText] = useState<string>()
  const [searchText, setSearchText] = useState<string>()
  const [highlightIndex, setHighlightIndex] = useState<number>()
  const [modalVisible, setModalVisible] = useState<boolean>()

  const router = useRouter()

  // Debounce typing. Only set new `searchText` if `inputText` doesn't change for `DEBOUNCE_MILLIS`
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchText(inputText)
    }, DEBOUNCE_MILLIS)

    return () => {
      clearTimeout(timer)
    }
  }, [inputText])

  const { data: searchPages, isLoading: isLoadingSearch } =
    useProjectsSearch(searchText)

  const goToProject = useCallback(() => {
    if (highlightIndex === undefined) return

    const project = searchPages?.[highlightIndex]

    if (!project) return

    router.push(
      project.pv === PV_V2 ? `/@${project.handle}` : `/p/${project.handle}`,
    )
  }, [router, searchPages, highlightIndex])

  const reset = useCallback(() => {
    setModalVisible(false)
    setHighlightIndex(undefined)
    setSearchText(undefined)
  }, [])

  // Hot key listener to open modal
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.isComposing) return // i think right idk

      if (modalVisible) {
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
        setModalVisible(true)
        e.preventDefault() // Needed to prevent browsers from using default function for quick search command. Some browsers use cmd/ctrl + k to focus url bar
      }
    }

    window.addEventListener('keydown', listener)

    return () => {
      window.removeEventListener('keydown', listener)
    }
  }, [modalVisible, searchText, router, goToProject, reset])

  useEffect(() => {
    const timer = setTimeout(() => {
      // timeout to wait for dom render after opening modal

      if (modalVisible) {
        ;(document.getElementById(INPUT_ID) as HTMLInputElement | null)?.focus()
      }
    }, 0)

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [modalVisible])

  // Arrow key up/down & tab listener
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
    }

    window.addEventListener('keydown', listener)

    return () => {
      window.removeEventListener('keydown', listener)
    }
  }, [
    modalVisible,
    searchText,
    router,
    goToProject,
    searchPages,
    isLoadingSearch,
  ])

  return (
    <Modal
      centered
      open={modalVisible}
      onCancel={reset}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
      footer={null}
      closeIcon
      destroyOnClose
      bodyStyle={{ padding: 0 }}
    >
      <div className="flex items-center gap-5 p-5">
        <CloseCircleOutlined onClick={() => setModalVisible(false)} />
        <Input
          id={INPUT_ID}
          placeholder={t`Find a project`}
          onChange={e => setInputText(e.target.value)}
        />
      </div>

      <div hidden={!searchText} className="pb-5">
        {isLoadingSearch && <Loading />}

        {!!searchPages?.length && (
          <div className="flex flex-col">
            {searchPages.slice(0, MAX_RESULTS).map((p, i) => (
              <div
                key={p.id}
                className={twMerge(
                  'flex cursor-pointer items-baseline gap-2 py-2 px-5',
                  highlightIndex === i ? 'bg-smoke-75 dark:bg-slate-600' : '',
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

        {searchText && !isLoadingSearch && searchPages?.length === 0 && (
          <div className="text-center text-grey-400">
            <Trans>No results</Trans>
          </div>
        )}
      </div>
    </Modal>
  )
}
