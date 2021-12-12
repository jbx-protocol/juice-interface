import { InfoCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Select, Space, Tooltip } from 'antd'
import Loading from 'components/shared/Loading'
import ProjectsGrid from 'components/shared/ProjectsGrid'
import { layouts } from 'constants/styles/layouts'
import { ThemeContext } from 'contexts/themeContext'
import { useInfiniteProjectsQuery } from 'hooks/Projects'
import { ProjectState } from 'models/project-visibility'
import { useContext, useEffect, useRef, useState } from 'react'

type OrderByOption = 'createdAt' | 'totalPaid'

const pageSize = 20

export default function Projects() {
  const [selectedTab, setSelectedTab] = useState<ProjectState>('active')
  const [orderBy, setOrderBy] = useState<OrderByOption>('totalPaid')

  const loadMoreContainerRef = useRef<HTMLDivElement>(null)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const {
    data: pages,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteProjectsQuery({
    orderBy,
    pageSize,
    orderDirection: 'desc',
    filter: selectedTab,
  })

  // When we scroll within 200px of our loadMoreContainerRef, fetch the next page.
  useEffect(() => {
    if (loadMoreContainerRef.current) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries.find(e => e.isIntersecting) && hasNextPage) {
            fetchNextPage()
          }
        },
        {
          rootMargin: '200px',
        },
      )
      observer.observe(loadMoreContainerRef.current)

      return () => observer.disconnect()
    }
  }, [fetchNextPage, hasNextPage])

  const concatenatedPages = pages?.pages?.reduce(
    (prev, group) => [...prev, ...group],
    [],
  )

  const tab = (tab: ProjectState) => (
    <div
      style={{
        textTransform: 'uppercase',
        cursor: 'pointer',
        borderBottom: '2px solid transparent',
        paddingBottom: 6,
        ...(tab === selectedTab
          ? {
              color: colors.text.primary,
              fontWeight: 500,
              borderColor: colors.text.primary,
            }
          : {
              color: colors.text.secondary,
              borderColor: 'transparent',
            }),
      }}
      onClick={() => setSelectedTab(tab)}
    >
      {tab}
    </div>
  )

  return (
    <div style={{ ...layouts.maxWidth }}>
      <h1>
        <Trans>Projects on Juicebox</Trans>
      </h1>
      <p style={{ marginBottom: 40, maxWidth: 800 }}>
        <Trans>
          <InfoCircleOutlined />
          The Juicebox protocol is open to anyone, and project configurations
          can vary widely. There are risks associated with interacting with all
          projects on the protocol. Projects built on the protocol are not
          endorsed or vetted by JuiceboxDAO, so you should do your own research
          and understand the risks before committing your funds.
        </Trans>
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          marginBottom: 40,
        }}
      >
        <div style={{ height: 40 }}>
          <Space direction="horizontal" size="large">
            {tab('active')}
            {tab('archived')}
          </Space>
        </div>

        <div>
          <Space direction="horizontal">
            <Select
              value={orderBy}
              onChange={setOrderBy}
              style={{ width: 120 }}
            >
              <Select.Option value="totalPaid">Volume</Select.Option>
              <Select.Option value="createdAt">Created</Select.Option>
            </Select>
            <a href="/#/create" style={{ marginLeft: 10 }}>
              <Button>New project</Button>
            </a>
          </Space>
        </div>
      </div>

      {selectedTab === 'archived' && (
        <p style={{ marginBottom: 40, maxWidth: 800 }}>
          <Trans>
            <InfoCircleOutlined /> Archived projects have not been modified or
            deleted on the blockchain, and can still be interacted with directly
            through the Juicebox contracts.{' '}
          </Trans>
          <Tooltip
            title={t`If you have a project you'd like to archive, let the Juicebox team know in Discord.`}
          >
            <span
              style={{
                color: colors.text.action.primary,
                fontWeight: 500,
                cursor: 'default',
              }}
            >
              <Trans>How do I archive a project?</Trans>
            </span>
          </Tooltip>
        </p>
      )}

      {concatenatedPages && <ProjectsGrid projects={concatenatedPages} />}
      {(isLoading || isFetchingNextPage) && <Loading />}

      {/* Place a div below the grid that we can connect to an intersection observer */}
      <div ref={loadMoreContainerRef} />

      {hasNextPage && !isFetchingNextPage && (
        <div
          role="button"
          style={{
            textAlign: 'center',
            color: colors.text.secondary,
            cursor: 'pointer',
          }}
          onClick={() => fetchNextPage()}
        >
          Load more
        </div>
      )}

      {!isFetchingNextPage && !isLoading && (
        <div
          style={{
            padding: 20,
            textAlign: 'center',
            color: colors.text.disabled,
          }}
        >
          No projects
        </div>
      )}
    </div>
  )
}
