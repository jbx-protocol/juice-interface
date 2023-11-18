import {
  createServerSupabaseClient,
  Session,
} from '@supabase/auth-helpers-nextjs'
import { AccountSettingsDashboard } from 'components/AccountSettingsDashboard/AccountSettingsDashboard'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { resolveAddress } from 'lib/api/ens'
import { User } from 'models/database'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Database } from 'types/database.types'
import { isEqualAddress } from 'utils/address'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

type AccountSettingsType = {
  initialSession: Session
  user: User
}

export const getServerSideProps: GetServerSideProps<
  AccountSettingsType
> = async context => {
  const global = await globalGetServerSideProps(context)

  const supabase = createServerSupabaseClient<Database>(context)
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (
    !session ||
    !context.params?.addressOrEnsName ||
    typeof context.params.addressOrEnsName !== 'string'
  ) {
    return {
      ...global,
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  const pair = await resolveAddress(context.params.addressOrEnsName).catch(
    () => undefined,
  )
  if (!pair) {
    return {
      ...global,
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const user = await supabase
    .from('users')
    .select(
      'created_at, email, email_verified, id, updated_at, wallet, bio, website, twitter',
    )
    .eq('id', session.user.id)
    .single()

  if (!user.data) {
    return {
      ...global,
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  if (!isEqualAddress(user.data.wallet, pair.address)) {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      console.info('Error occurred on signout', e)
    }
    return {
      ...global,
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    ...global,
    props: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...((global as any).props || {}),
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
