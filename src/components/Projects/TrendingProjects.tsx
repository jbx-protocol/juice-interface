import { InformationCircleIcon } from '@heroicons/react/24/outline'
import Grid from 'components/Grid'
import Loading from 'components/Loading'
import { useTrendingProjects } from 'hooks/useTrendingProjects'
import { useWalletBookmarkedIds } from 'hooks/useWalletBookmarkedProjects'
import { useWallet } from 'hooks/Wallet'
import RankingExplanation from './RankingExplanation'
import TrendingProjectCard from './TrendingProjectCard'

export default function TrendingProjects({
  count, // number of trending project cards to show
}: {
  count: number
}) {
  const { data: projects, isLoading } = useTrendingProjects(count)

  const { userAddress } = useWallet()

  const { ids: bookmarkedProjectIds } = useWalletBookmarkedIds({
    wallet: userAddress,
  })

  return (
    <div>
      {projects && projects.length > 0 && (
        <Grid>
          {projects.map((p, i) => (
            <TrendingProjectCard
              project={p}
              rank={i + 1}
              key={p.id}
              size="lg"
              bookmarked={bookmarkedProjectIds.has(p.id)}
            />
          ))}
        </Grid>
      )}

      {isLoading && (
        <div className="mt-10">
          <Loading />
        </div>
      )}

      <p className="my-10 max-w-3xl gap-1">
        <InformationCircleIcon className="inline h-4 w-4" />{' '}
        <RankingExplanation />
      </p>
    </div>
  )
}
