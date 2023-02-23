import { AccountDashboard } from 'components/AccountDashboard'
import { AppWrapper, SEO } from 'components/common'
import { readProvider } from 'constants/readProvider'
import { isAddress } from 'ethers/lib/utils'
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

  if (isAddress(addressOrEnsName)) {
    const ensName = await readProvider.lookupAddress(addressOrEnsName)
    return {
      props: {
        address: addressOrEnsName,
        ensName,
      },
    }
  }

  if (addressOrEnsName.includes('.eth')) {
    const address = await readProvider.resolveName(addressOrEnsName)
    if (!address) {
      return { notFound: true }
    }

    return {
      props: {
        address,
        ensName: addressOrEnsName,
      },
    }
  }

  return { notFound: true }
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
