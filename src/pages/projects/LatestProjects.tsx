import { t, Trans } from '@lingui/macro'
import Grid from 'components/Grid'
import Loading from 'components/Loading'
import ProjectCard, { ProjectCardProject } from 'components/ProjectCard'
import { ThemeContext } from 'contexts/themeContext'
import { useInfiniteProjectsQuery } from 'hooks/Projects'
import { useContext, useEffect, useRef } from 'react'
import { useLoadMoreContent } from '../../hooks/LoadMore'

export default function LatestProjects() {
  const pageSize = 20
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
    orderBy: 'createdAt',
    pageSize,
    orderDirection: 'desc',
  })
  const loadMoreContainerRef = useRef<HTMLDivElement>(null)

  const [visible] = useLoadMoreContent({
    loadMoreContainerRef,
    hasNextPage,
  })
  const concatenatedPages = pages?.pages?.reduce(
    (prev, group) => [...prev, ...group],
    [],
  )

  useEffect(() => {
    if (visible) {
      fetchNextPage()
    }
  }, [fetchNextPage, visible])

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
        !isLoading && (
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
          </div>
        )
      )}
    </>
  )
}
