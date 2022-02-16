import { InfoCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import Search from 'antd/lib/input/Search'
import FeedbackFormLink from 'components/shared/FeedbackFormLink'
import Loading from 'components/shared/Loading'

import { ProjectCategory } from 'models/project-visibility'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import Grid from 'components/shared/Grid'
import ProjectCard from 'components/shared/ProjectCard'

import { Link, useHistory, useLocation } from 'react-router-dom'

import { useInfiniteProjectsQuery, useProjectsSearch } from 'hooks/v1/Projects'
import { V1TerminalVersion } from 'models/v1/terminals'

import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'

import { layouts } from 'constants/styles/layouts'
import TrendingProjects from './TrendingProjects'
import ProjectsTabs from './ProjectsTabs'
import HoldingsProjects from './HoldingsProjects'
import ProjectsFilterAndSort from './ProjectsFilterAndSort'
import ArchivedProjectsMessage from './ArchivedProjectsMessage'

type OrderByOption = 'createdAt' | 'totalPaid'

const pageSize = 20

const defaultTab: ProjectCategory = 'trending'

export default function Projects() {
  const [selectedTab, setSelectedTab] = useState<ProjectCategory>(defaultTab)

  // Checks URL to see if tab has been set
  const location = useLocation()
  const history = useHistory()

  const { userAddress } = useContext(NetworkContext)

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  )

  useEffect(() => {
    setSelectedTab(() => {
      switch (params.get('tab')) {
        case 'trending':
          return 'trending'
        case 'all':
          return 'all'
        case 'holdings':
          // If no wallet connected, revert to default tab
          return userAddress ? 'holdings' : defaultTab
        default:
          return defaultTab
      }
    })
  }, [userAddress, params])

  const [searchText, setSearchText] = useState<string>(
    params.get('search') ?? '',
  )

  const [orderBy, setOrderBy] = useState<OrderByOption>('totalPaid')
  const [includeV1, setIncludeV1] = useState<boolean>(true)
  const [includeV1_1, setIncludeV1_1] = useState<boolean>(true)
  const [showArchived, setShowArchived] = useState<boolean>(false)

  const loadMoreContainerRef = useRef<HTMLDivElement>(null)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const terminalVersion: V1TerminalVersion | undefined = useMemo(() => {
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
    state: showArchived ? 'archived' : 'active',
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

          <Link to="/create">
            <Button>
              <Trans>Create project</Trans>
            </Button>
          </Link>
        </div>

        <div>
          <p style={{ maxWidth: 800, marginBottom: 20 }}>
            <Trans>
              <InfoCircleOutlined /> The Juicebox protocol is open to anyone,
              and project configurations can vary widely. There are risks
              associated with interacting with all projects on the protocol.
              Projects built on the protocol are not endorsed or vetted by
              JuiceboxDAO. Do your own research and understand the risks before
              committing your funds.
            </Trans>
          </p>
        </div>

        <Search
          autoFocus
          style={{ flex: 1, marginBottom: 20, marginRight: 20 }}
          prefix="@"
          placeholder={t`Search projects by handle`}
          onSearch={val => {
            setSearchText(val)
            history.push(`/projects?tab=all${val ? `&search=${val}` : ''}`)
          }}
          defaultValue={searchText}
          allowClear
        />

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
          <ProjectsTabs selectedTab={selectedTab} />

          {selectedTab === 'all' && !searchText ? (
            <ProjectsFilterAndSort
              includeV1={includeV1}
              setIncludeV1={setIncludeV1}
              includeV1_1={includeV1_1}
              setIncludeV1_1={setIncludeV1_1}
              showArchived={showArchived}
              setShowArchived={setShowArchived}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
            />
          ) : null}
        </div>
        <ArchivedProjectsMessage
          hidden={!showArchived || selectedTab !== 'all'}
        />
      </div>

      {selectedTab === 'all' ? (
        <React.Fragment>
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
      ) : selectedTab === 'holdings' ? (
        <div style={{ paddingBottom: 50 }}>
          <HoldingsProjects />
        </div>
      ) : selectedTab === 'trending' ? (
        <div style={{ paddingBottom: 50 }}>
          <TrendingProjects count={12} trendingWindowDays={7} />
        </div>
      ) : null}
      <FeedbackFormLink />
    </div>
  )
}
