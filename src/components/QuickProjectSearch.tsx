import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  EnterOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import Input from 'antd/lib/input/Input'
import Modal from 'antd/lib/modal/Modal'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { PV_V2 } from 'constants/pv'
import { useModal } from 'hooks/Modal'
import { useProjectsSearch, useSepanaProjectsSearch } from 'hooks/Projects'
import { SepanaProject } from 'models/sepana'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { featureFlagEnabled } from 'utils/featureFlags'
import { formatWad } from 'utils/format/formatNumber'
import CurrencySymbol from './CurrencySymbol'

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
  const modal = useModal()

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

  const sepanaEnabled = featureFlagEnabled(FEATURE_FLAGS.SEPANA_SEARCH)

  const { data: sepanaSearchResults, isLoading: isLoadingSepanaSearch } =
    useSepanaProjectsSearch(searchText, { pageSize: MAX_RESULTS })

  const { data: graphSearchResults, isLoading: isLoadingGraphSearch } =
    useProjectsSearch(searchText)

  const searchResults = sepanaEnabled ? sepanaSearchResults : graphSearchResults
  const isLoadingSearch = sepanaEnabled
    ? isLoadingSepanaSearch
    : isLoadingGraphSearch

  const goToProject = useCallback(() => {
    if (highlightIndex === undefined) return

    const project = searchResults?.[highlightIndex]

    if (!project) return

    router.push(
      project.pv === PV_V2 ? `/@${project.handle}` : `/p/${project.handle}`,
    )
  }, [router, searchResults, highlightIndex])

  const reset = useCallback(() => {
    modal.close()
    setHighlightIndex(undefined)
    setSearchText(undefined)
  }, [modal])

  // Hot key listener to open modal
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.isComposing) return // i think right idk

      if (modal.visible) {
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
        modal.open()
        e.preventDefault() // Needed to prevent browsers from using default function for quick search command. Some browsers use cmd/ctrl + k to focus url bar
      }
    }

    window.addEventListener('keydown', listener)

    return () => {
      window.removeEventListener('keydown', listener)
    }
  }, [searchText, router, goToProject, reset, modal])

  useEffect(() => {
    const timer = setTimeout(() => {
      // timeout to wait for dom render after opening modal

      if (modal.visible) {
        ;(document.getElementById(INPUT_ID) as HTMLInputElement | null)?.focus()
      }
    }, 0)

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [modal.visible])

  // Arrow key up/down & tab listener
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (!searchResults || isLoadingSearch) return

      switch (e.key) {
        case 'ArrowUp':
          setHighlightIndex(i => (i === undefined ? 0 : Math.max(i - 1, 0)))
          break
        case 'ArrowDown':
        case 'Tab':
          setHighlightIndex(i =>
            i === undefined ? 0 : Math.min(i + 1, searchResults.length - 1),
          )
          break
      }
    }

    window.addEventListener('keydown', listener)

    return () => {
      window.removeEventListener('keydown', listener)
    }
  }, [
    modal.visible,
    searchText,
    router,
    goToProject,
    searchResults,
    isLoadingSearch,
  ])

  return (
    <>
      <SearchOutlined
        className="mt-1 text-2xl leading-none transition-colors hover:text-haze-400"
        onClick={modal.open}
      />
      <Modal
        closable={false}
        className="top-16"
        open={modal.visible}
        onCancel={reset}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        footer={null}
        destroyOnClose
        bodyStyle={{ padding: 0 }}
      >
        <div className="dark:bg-slate-700">
          <div className="flex items-center gap-5 px-5 pb-2 pt-8">
            <Input
              prefix={
                <SearchOutlined className="mt-1 mr-2 text-2xl leading-none" />
              }
              allowClear
              className="border-smoke-300 text-black dark:border-slate-300 dark:text-slate-100 dark:placeholder:text-slate-300"
              size="large"
              id={INPUT_ID}
              placeholder={t`Find a project`}
              onChange={e => setInputText(e.target.value)}
            />
          </div>

          <div hidden={!searchText}>
            {isLoadingSearch && <Loading />}

            {!!searchResults?.length && (
              <div className="flex flex-col">
                {searchResults.slice(0, MAX_RESULTS).map((p, i) => (
                  <div
                    key={p.id}
                    className={twMerge(
                      'flex cursor-pointer items-baseline gap-3 py-2 px-5',
                      highlightIndex === i
                        ? 'bg-smoke-75 dark:bg-slate-600'
                        : '',
                    )}
                    onClick={goToProject}
                    onMouseEnter={() => setHighlightIndex(i)}
                  >
                    {p.pv === PV_V2 ? (
                      <V2V3ProjectHandleLink
                        projectId={p.projectId}
                        handle={p.handle}
                        name={
                          sepanaEnabled ? (p as SepanaProject).name : undefined
                        }
                      />
                    ) : (
                      <V1ProjectHandle
                        projectId={p.projectId}
                        handle={p.handle}
                      />
                    )}

                    <div className="text-xs font-bold text-slate-200 dark:text-slate-200">
                      <CurrencySymbol currency="ETH" />
                      {formatWad(p.totalPaid, { precision: 0 })}
                    </div>

                    <ProjectVersionBadge
                      className="text-slate-200 dark:text-slate-300"
                      transparent
                      size="small"
                      versionText={`V${p.pv}`}
                    />

                    <div className="flex-1 text-right">
                      {highlightIndex === i && <ArrowRightOutlined />}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchText && !isLoadingSearch && searchResults?.length === 0 && (
              <div className="text-center text-grey-400">
                <Trans>No results</Trans>
              </div>
            )}
          </div>

          <div className="mt-5 flex gap-6 border-t border-r-0 border-b-0 border-l-0 border-solid border-t-smoke-200 bg-smoke-75 py-4 px-5 text-xs dark:border-t-slate-300 dark:bg-slate-600">
            <span>
              <KeyboardButton>
                <EnterOutlined />
              </KeyboardButton>{' '}
              to select
            </span>
            <span>
              <KeyboardButton>
                <ArrowUpOutlined />
              </KeyboardButton>
              <KeyboardButton>
                <ArrowDownOutlined />
              </KeyboardButton>{' '}
              to navigate
            </span>
            <span>
              <KeyboardButton>esc</KeyboardButton> to close
            </span>
          </div>
        </div>
      </Modal>
    </>
  )
}

const KeyboardButton = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded bg-white px-1.5 py-0.5 dark:bg-slate-700">
    {children}
  </span>
)
