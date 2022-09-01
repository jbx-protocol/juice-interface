import { InfoCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import Search from 'antd/lib/input/Search'
import { AppWrapper } from 'components/common'
import FeedbackFormButton from 'components/FeedbackFormButton'
import Loading from 'components/Loading'

import { ProjectCategory } from 'models/project-visibility'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'

import Grid from 'components/Grid'
import ProjectCard, { ProjectCardProject } from 'components/ProjectCard'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { useInfiniteProjectsQuery, useProjectsSearch } from 'hooks/Projects'

import { ThemeContext } from 'contexts/themeContext'
import { useWallet } from 'hooks/Wallet'

import ExternalLink from 'components/ExternalLink'
import { CV } from 'models/cv'
import { helpPagePath } from 'utils/routes'

import { layouts } from 'constants/styles/layouts'
import ArchivedProjectsMessage from './ArchivedProjectsMessage'
import HoldingsProjects from './HoldingsProjects'
import MyProjects from './MyProjects'
import ProjectsFilterAndSort from './ProjectsFilterAndSort'
import ProjectsTabs from './ProjectsTabs'
import TrendingProjects from './TrendingProjects'

export default function ProjectsPage() {
  return (
    <AppWrapper>
      <Projects />
    </AppWrapper>
  )
}

type OrderByOption = 'createdAt' | 'totalPaid'

const pageSize = 20

const defaultTab: ProjectCategory = 'trending'

function Projects() {
  const [selectedTab, setSelectedTab] = useState<ProjectCategory>(defaultTab)

  // Checks URL to see if tab has been set
  const router = useRouter()

  const { userAddress } = useWallet()

  const [searchText, setSearchText] = useState<string>(
    (router.query.search as string | undefined) ?? '',
  )

  useEffect(() => {
    setSelectedTab(() => {
      switch (router.query.tab) {
        case 'trending':
          return 'trending'
        case 'all':
          return 'all'
        case 'holdings':
          return 'holdings'
        case 'myprojects':
          return 'myprojects'
        default:
          return defaultTab
      }
    })
    setSearchText(router.query.search as string)
  }, [userAddress, router.query.tab, router.query.search])

  const [orderBy, setOrderBy] = useState<OrderByOption>('totalPaid')
  const [includeV1, setIncludeV1] = useState<boolean>(true)
  const [includeV1_1, setIncludeV1_1] = useState<boolean>(true)
  const [includeV2, setIncludeV2] = useState<boolean>(true)
  const [showArchived, setShowArchived] = useState<boolean>(false)

  const loadMoreContainerRef = useRef<HTMLDivElement>(null)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const cv: CV[] | undefined = useMemo(() => {
    const _cv: CV[] = []
    if (includeV1) _cv.push('1')
    if (includeV1_1) _cv.push('1.1')
    if (includeV2) _cv.push('2')
    return _cv.length ? _cv : ['1', '1.1', '2']
  }, [includeV1, includeV1_1, includeV2])

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
    cv,
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

          <Link href="/create">
            <a>
              <Button type="primary" size="large">
                <Trans>Create project</Trans>
              </Button>
            </a>
          </Link>
        </div>

        <div>
          <p style={{ maxWidth: 800, marginBottom: 20 }}>
            <Trans>
              <InfoCircleOutlined /> The Juicebox protocol is open to anyone,
              and project configurations can vary widely. There are risks
              associated with interacting with all projects on the protocol.
              Projects built on the protocol are not endorsed or vetted by
              JuiceboxDAO or Peel. Do your own research and understand the{' '}
              <ExternalLink href={helpPagePath('/dev/learn/risks')}>
                risks
              </ExternalLink>{' '}
              before committing your funds.
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
            router.push(`/projects?tab=all${val ? `&search=${val}` : ''}`)
          }}
          defaultValue={searchText}
          key={searchText}
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

          {selectedTab === 'all' ? (
            <ProjectsFilterAndSort
              includeV1={includeV1}
              includeV1_1={includeV1_1}
              includeV2={includeV2}
              setIncludeV1={setIncludeV1}
              setIncludeV1_1={setIncludeV1_1}
              setIncludeV2={setIncludeV2}
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
        <>
          {concatenatedPages && (
            <Grid>
              {concatenatedPages.map(p => (
                <ProjectCard
                  key={`${p.id}_${p.cv}`}
                  project={p as ProjectCardProject}
                />
              ))}
            </Grid>
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
                  paddingTop: concatenatedPages?.length === 0 ? 0 : 20,
                }}
              >
                {concatenatedPages?.length}{' '}
                {concatenatedPages?.length === 1 ? t`project` : t`projects`}{' '}
                {searchText ? t`matching "${searchText}"` : ''}
              </div>
            )
          )}
        </>
      ) : selectedTab === 'holdings' ? (
        <div style={{ paddingBottom: 50 }}>
          <HoldingsProjects />
        </div>
      ) : selectedTab === 'myprojects' ? (
        <div style={{ paddingBottom: 50 }}>
          <MyProjects />
        </div>
      ) : selectedTab === 'trending' ? (
        <div style={{ paddingBottom: 50 }}>
          <TrendingProjects count={12} />
        </div>
      ) : null}

      <FeedbackFormButton />
    </div>
  )
}
