import Loading from 'components/Loading'
import { useHasNftRewards } from 'hooks/JB721Delegate/useHasNftRewards'
import { EditNftsTabs } from '../EditNftsPage/EditNftsTabs'
import { LaunchNftCollection } from './LaunchNftCollection'

export function NewEditNftsPage() {
  const { value: hasExistingNfts, loading: hasNftsLoading } = useHasNftRewards()

  if (hasNftsLoading) {
    return <Loading />
  }
  if (hasExistingNfts) {
    return <EditNftsTabs />
  } else {
    return <LaunchNftCollection />
  }
}
