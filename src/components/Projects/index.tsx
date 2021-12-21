import { InfoCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Checkbox, Select, Space, Tooltip } from 'antd'
import Search from 'antd/lib/input/Search'
import Loading from 'components/shared/Loading'
import ProjectsGrid from 'components/shared/ProjectsGrid'
import { layouts } from 'constants/styles/layouts'
import { ThemeContext } from 'contexts/themeContext'
import { useInfiniteProjectsQuery, useProjectsSearch } from 'hooks/Projects'
import { ProjectState } from 'models/project-visibility'
import { TerminalVersion } from 'models/terminal-version'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'

type OrderByOption = 'createdAt' | 'totalPaid'

const pageSize = 20

export default function Projects() {
  const [searchText, setSearchText] = useState<string>()
  const [selectedTab, setSelectedTab] = useState<ProjectState>('active')
  const [orderBy, setOrderBy] = useState<OrderByOption>('totalPaid')
  const [includeV1, setIncludeV1] = useState<boolean>(true)
  const [includeV1_1, setIncludeV1_1] = useState<boolean>(true)

  const loadMoreContainerRef = useRef<HTMLDivElement>(null)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const terminalVersion: TerminalVersion | undefined = useMemo(() => {
    if (includeV1 && !includeV1_1) return '1'
    if (!includeV1 && includeV1_1) return '1.1'
  }, [includeV1, includeV1_1])

  const {
    data: pages,
    isLoading: isLoadingProjects,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteProjectsQuery({
    orderBy,
    pageSize,
    orderDirection: 'desc',
    filter: selectedTab,
    terminalVersion,
  })

  const { data: searchPages, isLoading: isLoadingSearch } =
    useProjectsSearch(searchText)

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

  const isLoading = isLoadingProjects || isLoadingSearch

  const concatenatedPages = searchText?.length
    ? searchPages
    : pages?.pages?.reduce((prev, group) => [...prev, ...group], [])

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

      <div>
        <p style={{ maxWidth: 800, marginBottom: 20 }}>
          <Trans>
            <InfoCircleOutlined /> The Juicebox protocol is open to anyone, and
            project configurations can vary widely. There are risks associated
            with interacting with all projects on the protocol. Projects built
            on the protocol are not endorsed or vetted by JuiceboxDAO, so you
            should do your own research and understand the risks before
            committing your funds.
          </Trans>
        </p>

        <Search
          autoFocus
          style={{ marginBottom: 20 }}
          prefix="@"
          placeholder="Search projects by handle"
          onSearch={val => setSearchText(val)}
          allowClear
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          maxWidth: '100vw',
          marginBottom: 40,
        }}
      >
        <div style={{ height: 40, marginBottom: 10 }}>
          <Space direction="horizontal" size="large">
            {tab('active')}
            {tab('archived')}
          </Space>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            whiteSpace: 'pre',
            flexWrap: 'wrap',
            maxWidth: '100vw',
          }}
        >
          <Space
            direction="horizontal"
            size="middle"
            style={{ marginRight: 20, marginTop: 10, marginBottom: 10 }}
          >
            <div>
              <Checkbox
                checked={includeV1}
                onChange={() => setIncludeV1(!includeV1)}
              />{' '}
              V1
            </div>
            <div>
              <Checkbox
                checked={includeV1_1}
                onChange={() => setIncludeV1_1(!includeV1_1)}
              />{' '}
              V1.1
            </div>
          </Space>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <Select
              value={orderBy}
              onChange={setOrderBy}
              style={{ width: 120, marginRight: 10 }}
            >
              <Select.Option value="totalPaid">Volume</Select.Option>
              <Select.Option value="createdAt">Created</Select.Option>
            </Select>
            <a href="/#/create">
              <Button>New project</Button>
            </a>
          </div>
        </div>
      </div>

      {selectedTab === 'archived' && (
        <p style={{ marginBottom: 40, maxWidth: 800 }}>
          <Trans>
            <InfoCircleOutlined /> Archived projects have not been modified or
            deleted on the blockchain, and can still be interacted with directly
            through the Juicebox contracts.
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
              {' '}
              <Trans>How do I archive a project?</Trans>
            </span>
          </Tooltip>
        </p>
      )}

      {concatenatedPages && <ProjectsGrid projects={concatenatedPages} />}
      {(isLoading || isFetchingNextPage) && <Loading />}

      {/* Place a div below the grid that we can connect to an intersection observer */}
      <div ref={loadMoreContainerRef} />

      {hasNextPage &&
      !isFetchingNextPage &&
      (concatenatedPages?.length || 0) > pageSize ? (
        <div
          role="button"
          style={{
            textAlign: 'center',
            color: colors.text.secondary,
            cursor: 'pointer',
            padding: 20,
          }}
          onClick={() => fetchNextPage()}
        >
          Load more
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            color: colors.text.secondary,
            padding: 20,
          }}
        >
          {concatenatedPages?.length} projects
        </div>
      )}

      {!isFetchingNextPage && !isLoading && !concatenatedPages?.length && (
        <div
          style={{
            padding: 20,
            textAlign: 'center',
            color: colors.text.disabled,
          }}
        >
          No projects {searchText ? ` matching ${searchText}` : ''}
        </div>
      )}
    </div>
  )
}
