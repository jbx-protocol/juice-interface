import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import Search from 'antd/lib/input/Search'
import { AppWrapper } from 'components/common'
import { PROJECTS_PAGE } from 'constants/fathomEvents'
import { PV_V1, PV_V2 } from 'constants/pv'
import { useWallet } from 'hooks/Wallet'
import { trackFathomGoal } from 'lib/fathom'
import { ProjectTag } from 'models/project-tags'
import { ProjectCategory } from 'models/projectVisibility'
import { PV } from 'models/pv'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import AllProjects from './AllProjects'
import ArchivedProjectsMessage from './ArchivedProjectsMessage'
import HoldingsProjects from './HoldingsProjects'
import LatestProjects from './LatestProjects'
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

type OrderByOption =
  | 'createdAt'
  | 'totalPaid'
  | 'currentBalance'
  | 'paymentsCount'

const defaultTab: ProjectCategory = 'trending'

function Projects() {
  const [selectedTab, setSelectedTab] = useState<ProjectCategory>(defaultTab)

  // Checks URL to see if tab has been set
  const router = useRouter()
  const search = Array.isArray(router.query.search)
    ? router.query.search[0]
    : router.query.search
  const tags = useMemo(
    () =>
      (Array.isArray(router.query.tags)
        ? router.query.tags[0].split(',')
        : router.query.tags
        ? router.query.tags.split(',')
        : []) as ProjectTag[],
    [router.query],
  )

  const { userAddress } = useWallet()
  const [searchText, setSearchText] = useState<typeof search>(search)
  const [searchTags, setSearchTags] = useState<ProjectTag[]>([])

  useEffect(() => {
    setSelectedTab(() => {
      switch (router.query.tab) {
        case 'trending':
          return 'trending'
        case 'all':
          return 'all'
        case 'new':
          return 'new'
        case 'holdings':
          return 'holdings'
        case 'myprojects':
          return 'myprojects'
        default:
          return defaultTab
      }
    })
    setSearchText(search)
    setSearchTags(tags)
  }, [userAddress, router.query.tab, search, tags])

  const [orderBy, setOrderBy] = useState<OrderByOption>('totalPaid')
  const [includeV1, setIncludeV1] = useState<boolean>(true)
  const [includeV2, setIncludeV2] = useState<boolean>(true)
  const [showArchived, setShowArchived] = useState<boolean>(false)
  const [reversed, setReversed] = useState<boolean>(false)

  const pv: PV[] | undefined = useMemo(() => {
    const _pv: PV[] = []
    if (includeV1) _pv.push(PV_V1)
    if (includeV2) _pv.push(PV_V2)
    return _pv.length ? _pv : [PV_V1, PV_V2]
  }, [includeV1, includeV2])

  return (
    <div className="my-0 mx-auto max-w-5xl p-5 pt-16">
      <div className="flex flex-col gap-6">
        <div>
          <header className="flex flex-wrap items-center justify-between gap-y-4 pb-3">
            <h1 className="mb-0 text-4xl text-black dark:text-slate-100">
              <Trans>Explore Projects</Trans>
            </h1>

            <Link href="/create">
              <a>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    trackFathomGoal(PROJECTS_PAGE.CREATE_A_PROJECT_CTA)
                  }}
                >
                  <Trans>Create project</Trans>
                </Button>
              </a>
            </Link>
          </header>
        </div>

        <div>
          <Search
            className="mb-4 flex-1"
            autoFocus
            placeholder={t`Search projects`}
            onSearch={val => {
              setSearchText(val)
              router.push(
                `/projects?tab=all${val ? `&search=${val}` : ''}${
                  searchTags.length ? `&tags=${searchTags.join(',')}` : ''
                }`,
              )
            }}
            defaultValue={searchText}
            key={searchText}
            allowClear
          />

          <div className="flex min-h-[52px] max-w-[100vw] flex-wrap items-center justify-between">
            <ProjectsTabs selectedTab={selectedTab} />

            {selectedTab === 'all' ? (
              <ProjectsFilterAndSort
                includeV1={includeV1}
                includeV2={includeV2}
                setIncludeV1={setIncludeV1}
                setIncludeV2={setIncludeV2}
                showArchived={showArchived}
                setShowArchived={setShowArchived}
                reversed={reversed}
                setReversed={setReversed}
                searchTags={searchTags}
                setSearchTags={tags => {
                  setSearchTags(tags)
                  router.push(
                    `/projects?tab=all${
                      tags.length ? `&tags=${tags.join(',')}` : ''
                    }${searchText ? `&search=${searchText}` : ''}`,
                  )
                }}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
              />
            ) : null}
          </div>
        </div>

        <div>
          <ArchivedProjectsMessage
            hidden={!showArchived || selectedTab !== 'all'}
          />
          {selectedTab === 'all' ? (
            <AllProjects
              pv={pv}
              searchText={searchText}
              searchTags={searchTags}
              orderBy={orderBy}
              showArchived={showArchived}
              reversed={reversed}
            />
          ) : selectedTab === 'holdings' ? (
            <HoldingsProjects />
          ) : selectedTab === 'myprojects' ? (
            <MyProjects />
          ) : selectedTab === 'trending' ? (
            <TrendingProjects count={12} />
          ) : selectedTab === 'new' ? (
            <LatestProjects />
          ) : null}
        </div>
      </div>
    </div>
  )
}
