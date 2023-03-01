import { t, Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import Search from 'antd/lib/input/Search'
import { AppWrapper } from 'components/common'
import { PROJECTS_PAGE } from 'constants/fathomEvents'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { PV_V1, PV_V2 } from 'constants/pv'
import { useWallet } from 'hooks/Wallet'
import { trackFathomGoal } from 'lib/fathom'
import {
  MAX_PROJECT_TAGS,
  ProjectTag,
  projectTagOptions
} from 'models/project-tags'
import { ProjectCategory } from 'models/projectVisibility'
import { PV } from 'models/pv'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'

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
  const tags = (
    Array.isArray(router.query.tags)
      ? router.query.tags[0].split(',')
      : router.query.tags.split(',')
  ) as ProjectTag[]

  const { userAddress } = useWallet()
  const [searchText, setSearchText] = useState<typeof search>(search)
  const [searchTags, setSearchTags] = useState<ProjectTag[]>([])

  const sepanaEnabled = featureFlagEnabled(FEATURE_FLAGS.SEPANA_SEARCH)

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
      <Space direction="vertical" className="w-full" size="large">
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
          {searchTags.length ? null : (
            <Search
              className="mb-4 flex-1"
              autoFocus
              placeholder={
                sepanaEnabled
                  ? t`Search projects`
                  : t`Search projects by handle`
              }
              onSearch={val => {
                setSearchText(val)
                router.push(`/projects?tab=all${val ? `&search=${val}` : ''}`)
              }}
              defaultValue={searchText}
              key={searchText}
              allowClear
            />
          )}

          {sepanaEnabled && !searchText && (
            <div className="mb-3">
              <ProjectTagsRow
                tags={[...projectTagOptions].sort(a =>
                  searchTags.includes(a) ? -1 : 1,
                )}
                tagClassName="text-sm"
                selectedTags={searchTags}
                onClickTag={t => {
                  let newTags: ProjectTag[] = []

                  if (searchTags.includes(t)) {
                    setSearchTags(v => {
                      newTags = v.filter(_t => _t !== t)
                      return newTags
                    })
                    router.push(
                      `/projects?tab=all${
                        newTags.length ? `&tags=${newTags.join(',')}` : ''
                      }`,
                    )
                  } else {
                    setSearchTags(v => {
                      newTags = [...v, t].slice(0, MAX_PROJECT_TAGS)
                      return newTags
                    })
                    router.push(`/projects?tab=all&tags=${newTags.join(',')}`)
                  }
                }}
              />
            </div>
          )}

          <div
            className="flex min-h-[52px] max-w-[100vw] flex-wrap items-center justify-between"
            hidden={!!searchText || !!searchTags.length}
          >
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
      </Space>
    </div>
  )
}
