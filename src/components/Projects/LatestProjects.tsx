import { t, Trans } from '@lingui/macro'
import Grid from 'components/Grid'
import Loading from 'components/Loading'
import ProjectCard from 'components/ProjectCard'
import { useDBProjectsInfiniteQuery } from 'hooks/useProjects'
import { useWalletBookmarkedIds } from 'hooks/useWalletBookmarkedProjects'
import { useWallet } from 'hooks/Wallet'
import { useEffect, useRef } from 'react'
import { classNames } from 'utils/classNames'
import { useLoadMoreContent } from '../../hooks/useLoadMore'

export default function LatestProjects() {
  const pageSize = 20

  const {
    data: pages,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useDBProjectsInfiniteQuery({
    orderBy: 'created_at',
    pageSize,
    orderDirection: 'desc',
  })

  const loadMoreContainerRef = useRef<HTMLDivElement>(null)

  const [scrolledToBottom] = useLoadMoreContent({
    loadMoreContainerRef,
    hasNextPage,
  })
  const concatenatedPages = pages?.pages?.reduce(
    (prev, group) => [...prev, ...group],
    [],
  )

  const { userAddress } = useWallet()

  const { ids: bookmarkedProjectIds } = useWalletBookmarkedIds({
    wallet: userAddress,
  })

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
              key={`${p.id}_${p.pv}`}
              project={p}
              bookmarked={bookmarkedProjectIds.has(p.id)}
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
            {concatenatedPages?.length === 1 ? t`project` : t`projects`}{' '}
          </div>
        )
      )}
    </>
  )
}
