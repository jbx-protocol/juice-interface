import {
  ArrowDownIcon,
  ArrowRightCircleIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import React, { useCallback, useContext, useEffect, useState } from 'react'

import EnterOutlined from '@ant-design/icons/EnterOutlined'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import Input from 'antd/lib/input/Input'
import Modal from 'antd/lib/modal/Modal'
import ETHAmount from 'components/currency/ETHAmount'
import Loading from 'components/Loading'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import { PV_V2, PV_V4 } from 'constants/pv'
import { useDBProjectsAggregateQuery } from 'hooks/useDBProjects'
import { useRouter } from 'next/router'
import V1ProjectHandle from 'packages/v1/components/shared/V1ProjectHandle'
import V2V3ProjectHandleLink from 'packages/v2v3/components/shared/V2V3ProjectHandleLink'
import { v2v3ProjectRoute } from 'packages/v2v3/utils/routes'
import { ChainLogo } from 'packages/v4/components/ChainLogo'
import { v4ProjectRoute } from 'packages/v4/utils/routes'
import { twMerge } from 'tailwind-merge'
import { QuickProjectSearchContext } from './QuickProjectSearchContext'

const INPUT_ID = 'quickProjectSearch'
const MAX_RESULTS = 8
const DEBOUNCE_MILLIS = 250

export const QuickProjectSearchModal = () => {
  const { modal } = useContext(QuickProjectSearchContext)

  const [inputText, setInputText] = useState<string>()
  const [searchText, setSearchText] = useState<string>()
  const [highlightIndex, setHighlightIndex] = useState<number>()

  const router = useRouter()

  const { data: searchResults, isLoading } = useDBProjectsAggregateQuery(
    {
      text: searchText,
      pageSize: MAX_RESULTS,
    },
    {
      enabled: modal.visible,
    },
  )

  const goToProject = useCallback(() => {
    if (highlightIndex === undefined || !searchResults?.length) return

    const { projectId, handle, pv, chainId } = searchResults[highlightIndex]

    router.push(
      pv === PV_V4
        ? v4ProjectRoute({ chainId, projectId })
        : pv === PV_V2
        ? v2v3ProjectRoute({ projectId, handle })
        : `/p/${handle}`,
    )
  }, [router, searchResults, highlightIndex])

  const reset = useCallback(() => {
    modal.close()
    setHighlightIndex(undefined)
    setSearchText(undefined)
  }, [modal])

  // Debounce typing. Only set new `searchText` if `inputText` doesn't change for `DEBOUNCE_MILLIS`
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchText(inputText)
    }, DEBOUNCE_MILLIS)

    return () => {
      clearTimeout(timer)
    }
  }, [inputText])

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
          default:
            break
        }
      }
    }

    window.addEventListener('keydown', listener)

    return () => {
      window.removeEventListener('keydown', listener)
    }
  }, [searchText, router, goToProject, reset, modal])

  useEffect(() => {
    // timeout to wait for dom render after opening modal
    const timer = setTimeout(() => {
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
      if (!searchResults || isLoading) return

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
  }, [modal.visible, searchText, router, searchResults, isLoading])

  return (
    <Modal
      closable={false}
      className="top-16"
      wrapClassName="rounded-lg"
      open={modal.visible}
      onCancel={reset}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
      footer={null}
      destroyOnClose
      bodyStyle={{ padding: 0 }}
    >
      <div className="rounded-lg dark:bg-slate-700">
        <div className="flex items-center gap-5 rounded-lg px-5 pb-2 pt-8">
          <Input
            prefix={
              <MagnifyingGlassIcon className="mt-1 mr-2 h-6 w-6 text-2xl leading-none" />
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
          {isLoading && <Loading />}

          {!!searchResults?.length && (
            <div className="flex flex-col">
              {searchResults.slice(0, MAX_RESULTS).map((p, i) => (
                <div
                  key={p.id}
                  className={twMerge(
                    'flex cursor-pointer items-baseline gap-3 py-2 px-5',
                    highlightIndex === i ? 'bg-smoke-75 dark:bg-slate-600' : '',
                  )}
                  onClick={goToProject}
                  onMouseEnter={() => setHighlightIndex(i)}
                >
                  {p.pv === PV_V4 ? (
                    p.name ?? `@${p.handle ?? '--'}`
                  ) : p.pv === PV_V2 ? (
                    <V2V3ProjectHandleLink
                      projectId={p.projectId}
                      handle={p.handle}
                      name={p.name}
                    />
                  ) : (
                    <V1ProjectHandle
                      projectId={p.projectId}
                      handle={p.handle}
                    />
                  )}

                  <div className="text-xs font-medium text-slate-200 dark:text-slate-200">
                    <ETHAmount amount={p.volume} precision={0} />
                  </div>

                  <ProjectVersionBadge
                    className="text-secondary"
                    transparent
                    size="small"
                    versionText={`V${p.pv}`}
                  />

                  <div className="flex gap-2">
                    {p.chainIds?.map(c => (
                      <div key={c}>
                        <ChainLogo width={18} height={18} chainId={c} />
                      </div>
                    ))}
                  </div>

                  <div className="flex-1 text-right">
                    {highlightIndex === i && (
                      <ArrowRightCircleIcon className="h-4 w-4" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchText && !isLoading && searchResults?.length === 0 && (
            <div className="text-center text-grey-400">
              <Trans>No results</Trans>
            </div>
          )}
        </div>

        <div className="mt-5 flex gap-6 rounded-b-lg border-t border-t-smoke-200 bg-smoke-75 py-4 px-5 text-xs dark:border-t-slate-300 dark:bg-slate-600">
          <span>
            <KeyboardButton>
              <EnterOutlined />
            </KeyboardButton>{' '}
            {t`to select`}
          </span>
          <div className="flex items-center gap-2">
            <KeyboardButton>
              <ArrowUpIcon className="h-4 w-4" />
            </KeyboardButton>
            <KeyboardButton>
              <ArrowDownIcon className="h-4 w-4" />
            </KeyboardButton>{' '}
            {t`to navigate`}
          </div>
          <span>
            <KeyboardButton>esc</KeyboardButton> {t`to close`}
          </span>
        </div>
      </div>
    </Modal>
  )
}

const KeyboardButton = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded bg-white px-1.5 py-0.5 dark:bg-slate-700">
    {children}
  </span>
)
