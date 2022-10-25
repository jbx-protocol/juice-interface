import { t, Trans } from '@lingui/macro'
import Grid from 'components/Grid'

import Loading from 'components/Loading'
import ProjectCard, { ProjectCardProject } from 'components/ProjectCard'
import { ThemeContext } from 'contexts/themeContext'
import { useLoadMoreContent } from 'hooks/LoadMore'
import { useInfiniteProjectsQuery, useProjectsSearch } from 'hooks/Projects'
import { CV } from 'models/cv'
import { useContext, useEffect, useRef } from 'react'

export default function AllProjects({
  cv,
  searchText,
  orderBy,
  showArchived,
}: {
  cv: CV[] | undefined
  searchText: string
  orderBy: 'createdAt' | 'totalPaid'
  showArchived: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const loadMoreContainerRef = useRef<HTMLDivElement>(null)
  const pageSize = 20

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

  const [scrolledToBottom] = useLoadMoreContent({
    loadMoreContainerRef,
    hasNextPage,
  })

  const isLoading = isLoadingProjects || isLoadingSearch

  const concatenatedPages = searchText?.length
    ? searchPages
    : pages?.pages?.reduce((prev, group) => [...prev, ...group], [])

  useEffect(() => {
    if (scrolledToBottom) {
      fetchNextPage()
    }
  }, [fetchNextPage, scrolledToBottom])

  return (
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
  )
}
