import { Trans, t } from '@lingui/macro'
import Grid from 'components/Grid'
import Loading from 'components/Loading'
import ProjectCard from 'components/ProjectCard'
import { useWallet } from 'hooks/Wallet'
import { useLoadMoreContent } from 'hooks/useLoadMore'
import { useDBProjectsInfiniteQuery } from 'hooks/useProjects'
import { useWalletBookmarkedIds } from 'hooks/useWalletBookmarkedProjects'
import { DBProjectQueryOpts } from 'models/dbProject'
import { ProjectTagName } from 'models/project-tags'
import { PV } from 'models/pv'
import { useEffect, useRef } from 'react'
import { classNames } from 'utils/classNames'

export default function AllProjects({
  pv,
  searchText,
  searchTags,
  orderBy,
  showArchived,
  reversed,
}: {
  pv: PV[] | undefined
  searchText: string
  searchTags: ProjectTagName[]
  orderBy: DBProjectQueryOpts['orderBy']
  showArchived: boolean
  reversed: boolean
}) {
  const loadMoreContainerRef = useRef<HTMLDivElement>(null)
  const pageSize = 20

  const {
    data: projects,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useDBProjectsInfiniteQuery({
    text: searchText,
    tags: searchTags,
    pv,
    orderBy,
    archived: showArchived,
    orderDirection: reversed ? 'asc' : 'desc',
    pageSize,
  })

  const [scrolledToBottom] = useLoadMoreContent({
    loadMoreContainerRef,
    hasNextPage,
  })

  const { userAddress } = useWallet()

  const { ids: bookmarkedProjectIds } = useWalletBookmarkedIds({
    wallet: userAddress,
  })

  const concatenatedPages = projects?.pages?.reduce(
    (prev, group) => [...prev, ...group],
    [],
  )

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
              key={p.id}
              project={p}
              bookmarked={bookmarkedProjectIds?.has(p.id)}
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
          className="cursor-pointer p-5 text-center text-grey-500 dark:text-grey-300"
          role="button"
          onClick={() => fetchNextPage()}
        >
          <Trans>Load more...</Trans>
        </div>
      ) : (
        !isLoading && (
          <div
            className={classNames(
              'px-5 pb-5 text-center text-grey-400 dark:text-slate-200',
              concatenatedPages?.length !== 0 ? 'pt-5' : '',
            )}
          >
            {concatenatedPages?.length}{' '}
            {concatenatedPages?.length === 1 ? t`project` : t`projects`}
          </div>
        )
      )}
    </>
  )
}
