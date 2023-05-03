import axios from 'axios'
import { AccountDashboard } from 'components/AccountDashboard'
import Loading from 'components/Loading'
import { AppWrapper, SEO } from 'components/common'
import { isAddress } from 'ethers/lib/utils'
import { resolveAddress } from 'lib/api/ens'
import { Profile } from 'models/database'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { truncateEthAddress } from 'utils/format/formatAddress'

function useEnsNamePair(addressOrEnsName: string | undefined) {
  return useQuery(['ensNamePair', addressOrEnsName], async () => {
    if (!addressOrEnsName) return

    const data = await resolveAddress(addressOrEnsName)
    return data
  })
}

function useAccount({ address }: { address: string | undefined }) {
  return useQuery(['account', address], async () => {
    if (!address) return

    const profile = await axios.get<{ profile: Profile | null }>(
      `/api/account/${address}`,
    )
    return profile.data.profile
  })
}

function _AccountPage({ addressOrEnsName }: { addressOrEnsName: string }) {
  const { data: ensNamePair, isLoading: ensLoading } =
    useEnsNamePair(addressOrEnsName)
  const { name: ensName, address } = ensNamePair ?? {}

  const { data: profile } = useAccount({ address })

  if (ensLoading) return <Loading />
  if (!address) return null

  return (
    <>
      <SEO title={ensName ?? truncateEthAddress({ address })} />
      <AccountDashboard address={address} ensName={ensName} profile={profile} />
    </>
  )
}

export default function AccountPage() {
  const router = useRouter()
  const { addressOrEnsName } = router.query as { addressOrEnsName: string }

  return (
    <AppWrapper>
      {addressOrEnsName &&
      (isAddress(addressOrEnsName) || addressOrEnsName.endsWith('eth')) ? (
        <_AccountPage addressOrEnsName={addressOrEnsName as string} />
      ) : (
        <div className="text-center">Not found</div>
      )}
    </AppWrapper>
  )
}
