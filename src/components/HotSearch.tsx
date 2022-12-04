import Input from 'antd/lib/input/Input'
import { CloseCircleOutlined, ArrowRightOutlined } from '@ant-design/icons'
import Modal from 'antd/lib/modal/Modal'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { useProjectsSearch } from 'hooks/Projects'
import Loading from './Loading'
import V2V3ProjectHandleLink from './v2v3/shared/V2V3ProjectHandleLink'

const HOT_KEY = 'k'
const INPUT_ID = 'hotsearch'

export default function HotSearch() {
  const [text, setText] = useState<string>()
  const [highlightIndex, setHighlightIndex] = useState<number>()
  const [spotlightActive, setSpotlightActive] = useState<boolean>()

  const router = useRouter()

  const { data: searchPages, isLoading: isLoadingSearch } =
    useProjectsSearch(text)

  const search = useCallback(() => {
    if (highlightIndex === undefined) return

    router.push(`/@${searchPages?.[highlightIndex]?.handle}`)
    // router.push(`/projects?tab=all${text ? `&search=${text}` : ''}`)
  }, [router, searchPages, highlightIndex])

  const reset = useCallback(() => {
    setSpotlightActive(false)
    setHighlightIndex(undefined)
    setText(undefined)
  }, [])

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
  }, [spotlightActive, text, router, search, reset])

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
  }, [spotlightActive, text, router, search, searchPages, isLoadingSearch])

  return (
    <Modal
      centered
      open={spotlightActive}
      onCancel={() => setSpotlightActive(false)}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
      footer={null}
      closeIcon
      destroyOnClose
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <CloseCircleOutlined onClick={() => setSpotlightActive(false)} />
        <Input
          id={INPUT_ID}
          placeholder="Search projects"
          onChange={e => setText(e.target.value)}
        />
        <ArrowRightOutlined onClick={search} />
      </div>
      {isLoadingSearch && <Loading />}
      {searchPages && (
        <div
          style={{ display: 'flex', flexDirection: 'column', paddingTop: 10 }}
        >
          {searchPages.map((p, i) => (
            <div
              key={p.id}
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                opacity: highlightIndex === i ? 1 : 0.5,
              }}
            >
              <V2V3ProjectHandleLink
                projectId={p.projectId}
                handle={p.handle}
              />
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
