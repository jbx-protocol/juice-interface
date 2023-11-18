import axios from 'axios'
import { AccountDashboard } from 'components/AccountDashboard/AccountDashboard'
import Loading from 'components/Loading'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { SEO } from 'components/common/SEO/SEO'
import { isAddress } from 'ethers/lib/utils'
import { resolveAddress } from 'lib/api/ens'
import { loadCatalog } from 'locales/utils'
import { Profile } from 'models/database'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useMemo } from 'react'
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

export default function AccountPage({
  addressOrEnsName,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const addressFound = useMemo(
    () => isAddress(addressOrEnsName) || addressOrEnsName.endsWith('eth'),
    [addressOrEnsName],
  )

  return (
    <AppWrapper>
      {addressOrEnsName && addressFound ? (
        <_AccountPage addressOrEnsName={addressOrEnsName as string} />
      ) : (
        <div className="text-center">Not found</div>
      )}
    </AppWrapper>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<{
  addressOrEnsName: string
}> = async context => {
  const locale = context.locale as string
  const messages = await loadCatalog(locale)
  const i18n = { locale, messages }

  const { addressOrEnsName } = context.params as { addressOrEnsName: string }
  return {
    props: {
      addressOrEnsName,
      i18n,
    },
  }
}
