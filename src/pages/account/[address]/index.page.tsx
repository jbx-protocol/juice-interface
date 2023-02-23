import { AccountDashboard } from 'components/AccountDashboard'
import { AppWrapper } from 'components/common'
import { isAddress } from 'ethers/lib/utils'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps<{
  address: string
}> = async context => {
  const address = context.params?.address as string | undefined

  if (!address || !isAddress(address as string)) {
    return {
      notFound: true,
    }
  }

  return { props: { address } }
}

export default function AccountPage() {
  const router = useRouter()
  const { address } = router.query

  return (
    <AppWrapper>
      <AccountDashboard address={address as string} />
    </AppWrapper>
  )
}
