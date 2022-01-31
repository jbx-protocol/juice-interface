import { InfoCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import Search from 'antd/lib/input/Search'
import FeedbackFormLink from 'components/shared/FeedbackFormLink'
import Loading from 'components/shared/Loading'

import { ThemeContext } from 'contexts/themeContext'

import { useInfiniteProjectsQuery, useProjectsSearch } from 'hooks/Projects'
import { ProjectCategory, ProjectStateFilter } from 'models/project-visibility'
import { TerminalVersion } from 'models/terminal-version'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import Grid from 'components/shared/Grid'
import ProjectCard from 'components/shared/ProjectCard'

import { layouts } from 'constants/styles/layouts'
import TrendingProjects from './TrendingProjects'
import ProjectsTabs from './ProjectsTabs'
import MyProjects from './MyProjects'
import ProjectsFilterAndSort from './ProjectsFilterAndSort'
import ArchivedProjectsMessage from './ArchivedProjectsMessage'
type OrderByOption = 'createdAt' | 'totalPaid'

const pageSize = 20

export default function Projects() {
  // Checks if user came from homepage trending section,
  // in which case auto open trending tab
  const trendingTabOpen = window.location.hash.split('=')[1] === 'trending'

  const [searchText, setSearchText] = useState<string>()
  const [selectedTab, setSelectedTab] = useState<ProjectCategory>(
    trendingTabOpen ? 'trending' : 'all',
  )
  const [orderBy, setOrderBy] = useState<OrderByOption>('totalPaid')
  const [includeV1, setIncludeV1] = useState<boolean>(true)
  const [includeV1_1, setIncludeV1_1] = useState<boolean>(true)
  const [includeActive, setIncludeActive] = useState<boolean>(true)
  const [includeArchived, setIncludeArchived] = useState<boolean>(false)

  const loadMoreContainerRef = useRef<HTMLDivElement>(null)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const includedStates: ProjectStateFilter = {
    active: includeActive,
    archived: includeArchived,
  }

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
    states: includedStates,
    terminalVersion,
  })

  const { data: searchPages, isLoading: isLoadingSearch } =
    useProjectsSearch(searchText)

  // When we scroll within 200px of our loadMoreContainerRef, fetch the next page.
  useEffect(() => {
    if (loadMoreContainerRef.current && selectedTab !== 'trending') {
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
  }, [selectedTab, fetchNextPage, hasNextPage])

  const isLoading = isLoadingProjects || isLoadingSearch

  const concatenatedPages = searchText?.length
    ? searchPages
    : pages?.pages?.reduce((prev, group) => [...prev, ...group], [])

  const filterOnlyArchived = !includeActive && includeArchived

  return (
    <div style={{ ...layouts.maxWidth }}>
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <h1>
            <Trans>Projects on Juicebox</Trans>
          </h1>

          <a href="/#/create">
            <Button>
              <Trans>Create project</Trans>
            </Button>
          </a>
        </div>

        <div>
          <p style={{ maxWidth: 800, marginBottom: 20 }}>
            <Trans>
              <InfoCircleOutlined /> The Juicebox protocol is open to anyone,
              and project configurations can vary widely. There are risks
              associated with interacting with all projects on the protocol.
              Projects built on the protocol are not endorsed or vetted by
              JuiceboxDAO, so you should do your own research and understand the
              risks before committing your funds.
            </Trans>
          </p>
        </div>

        <div
          hidden={!!searchText}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            maxWidth: '100vw',
          }}
        >
          <ProjectsTabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />

          {selectedTab === 'all' && !searchText ? (
            <ProjectsFilterAndSort
              includeV1={includeV1}
              setIncludeV1={setIncludeV1}
              includeV1_1={includeV1_1}
              setIncludeV1_1={setIncludeV1_1}
              includeActive={includeActive}
              setIncludeActive={setIncludeActive}
              includeArchived={includeArchived}
              setIncludeArchived={setIncludeArchived}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
            />
          ) : null}
        </div>
        <ArchivedProjectsMessage hidden={!filterOnlyArchived} />
      </div>

      {selectedTab === 'all' ? (
        <React.Fragment>
          {!filterOnlyArchived ? (
            <Search
              autoFocus
              style={{ flex: 1, marginBottom: 20, marginRight: 20 }}
              prefix="@"
              placeholder={t`Search projects by handle`}
              onSearch={val => setSearchText(val)}
              allowClear
            />
          ) : null}
          {concatenatedPages && (
            <Grid
              children={concatenatedPages.map((p, i) => (
                <ProjectCard key={i} project={p} />
              ))}
            />
          )}

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
              <Trans>Load more</Trans>
            </div>
          ) : (
            !isLoadingSearch &&
            !isLoadingProjects && (
              <div
                style={{
                  textAlign: 'center',
                  color: colors.text.disabled,
                  padding: 20,
                }}
              >
                {concatenatedPages?.length}{' '}
                {concatenatedPages?.length === 1 ? t`project` : t`projects`}{' '}
                {searchText ? t`matching "${searchText}"` : ''}
              </div>
            )
          )}
        </React.Fragment>
      ) : selectedTab === 'myprojects' ? (
        <div style={{ paddingBottom: 50 }}>
          <MyProjects />
        </div>
      ) : selectedTab === 'trending' ? (
        <div style={{ paddingBottom: 50 }}>
          <TrendingProjects count={12} />
        </div>
      ) : null}
      <FeedbackFormLink />
    </div>
  )
}
