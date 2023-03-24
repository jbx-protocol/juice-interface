import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { AccountDashboard } from 'components/AccountDashboard'
import { AppWrapper, SEO } from 'components/common'
import { resolveAddress } from 'lib/api/ens'
import { Profile } from 'models/database'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Database } from 'types/database.types'
import { truncateEthAddress } from 'utils/format/formatAddress'

interface AccountPageProps {
  address: string
  ensName: string | null
  profile: Profile | null
}

export const getServerSideProps: GetServerSideProps<
  AccountPageProps
> = async context => {
  const supabase = createServerSupabaseClient<Database>(context)

  if (!context.params?.addressOrEnsName) {
    return {
      notFound: true,
    }
  }

  const addressOrEnsName = context.params.addressOrEnsName as string

  const pair = await resolveAddress(addressOrEnsName).catch(() => undefined)
  if (!pair) {
    return {
      notFound: true,
    }
  }

  const { address, name: ensName } = pair

  let profile = null
  const profileResult = await supabase
    .from('user_profiles')
    .select('*')
    .eq('wallet', address.toLowerCase())
    .maybeSingle()
  if (profileResult.error) {
    console.error(
      'Error occurred while retrieving user profile',
      address.toLowerCase(),
    )
  }

  if (profileResult.data) {
    profile = profileResult.data
  }

  return {
    props: {
      address,
      ensName,
      profile,
    },
  }
}

export default function AccountPage({
  address,
  ensName,
  profile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AppWrapper>
      <SEO title={ensName ?? truncateEthAddress({ address })} />
      <AccountDashboard address={address} ensName={ensName} profile={profile} />
    </AppWrapper>
  )
}
