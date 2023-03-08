import {
  createServerSupabaseClient,
  Session,
} from '@supabase/auth-helpers-nextjs'
import { AccountSettingsDashboard } from 'components/AccountSettingsDashboard'
import { AppWrapper } from 'components/common'
import { User } from 'models/database'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Database } from 'types/database.types'

type AccountSettingsType = {
  initialSession: Session
  user: User
}

export const getServerSideProps: GetServerSideProps<
  AccountSettingsType
> = async context => {
  const supabase = createServerSupabaseClient<Database>(context)
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const user = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!user.data) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      initialSession: session,
      user: user.data,
    },
  }
}

export default function AccountSettingsPage({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AppWrapper>
      <AccountSettingsDashboard user={user} />
    </AppWrapper>
  )
}
