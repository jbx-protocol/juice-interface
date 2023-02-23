import { AccountDashboard } from 'components/AccountDashboard/AccountDashboard'
import { AppWrapper } from 'components/common'
import { useRouter } from 'next/router'

export default function AccountPage() {
  const router = useRouter()
  const { address } = router.query

  if (!address) return null

  return (
    <AppWrapper>
      <AccountDashboard address={address as string} />
    </AppWrapper>
  )
}
