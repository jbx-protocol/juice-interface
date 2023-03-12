import { AccountDashboard } from 'components/AccountDashboard'
import { AppWrapper, SEO } from 'components/common'
import { resolveEnsNameAddressPair } from 'lib/ssr/address'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { truncateEthAddress } from 'utils/format/formatAddress'

interface AccountPageProps {
  address: string
  ensName: string | null
}

export const getServerSideProps: GetServerSideProps<
  AccountPageProps
> = async context => {
  if (!context.params?.addressOrEnsName) {
    return {
      notFound: true,
    }
  }

  const addressOrEnsName = context.params.addressOrEnsName as string

  const pair = await resolveEnsNameAddressPair(addressOrEnsName)
  if (!pair) {
    return {
      notFound: true,
    }
  }
  const { address, ensName } = pair

  return {
    props: {
      address,
      ensName,
    },
  }
}

export default function AccountPage({
  address,
  ensName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AppWrapper>
      <SEO title={ensName ?? truncateEthAddress({ address })} />
      <AccountDashboard address={address} ensName={ensName} />
    </AppWrapper>
  )
}
