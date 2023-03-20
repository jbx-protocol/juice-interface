import { SettingOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Button, Tabs } from 'antd'
import { ActivityList } from 'components/ActivityList/ActivityList'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import Grid from 'components/Grid'
import Loading from 'components/Loading'
import Paragraph from 'components/Paragraph'
import SocialLinks from 'components/Project/ProjectHeader/SocialLinks'
import ProjectCard, { ProjectCardProject } from 'components/ProjectCard'
import ProjectLogo from 'components/ProjectLogo'
import { useContributedProjectsQuery, useMyProjectsQuery } from 'hooks/Projects'
import { useWallet } from 'hooks/Wallet'
import { AuthAPI } from 'lib/api/auth'
import { Profile } from 'models/database'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { ensAvatarUrlForAddress } from 'utils/ens'
import { truncateEthAddress } from 'utils/format/formatAddress'
import { v4 } from 'uuid'

function ProjectsList({ projects }: { projects: ProjectCardProject[] }) {
  return (
    <Grid>
      {projects?.map(p => (
        <ProjectCard project={p} key={p.id} />
      ))}
    </Grid>
  )
}

function ContributedList({ address }: { address: string }) {
  const { data: contributedProjects, isLoading: myProjectsLoading } =
    useContributedProjectsQuery(address)

  const { userAddress } = useWallet()

  if (myProjectsLoading) return <Loading />

  if (!contributedProjects || contributedProjects.length === 0)
    return (
      <span>
        {address === userAddress ? (
          <div>
            <p className="mb-5 dark:text-slate-100">
              <Trans>You haven't contributed to any projects yet!</Trans>
            </p>
            <Link href="/projects">
              <a>
                <Button type="primary">
                  <Trans>Explore projects</Trans>
                </Button>
              </a>
            </Link>
          </div>
        ) : (
          <p className="dark:text-slate-100">
            <Trans>This account hasn't contributed to any projects yet.</Trans>
          </p>
        )}
      </span>
    )

  return <ProjectsList projects={contributedProjects} />
}

function MyProjectsList({ address }: { address: string }) {
  const { data: myProjects, isLoading: myProjectsLoading } =
    useMyProjectsQuery(address)

  const { userAddress } = useWallet()

  if (myProjectsLoading) return <Loading />

  if (!myProjects || myProjects.length === 0)
    return (
      <span>
        {address === userAddress ? (
          <div>
            <p className="mb-5 dark:text-slate-100">
              <Trans>You haven't created any projects yet!</Trans>
            </p>

            <Link href="/create">
              <a>
                <Button type="primary">
                  <Trans>Create project</Trans>
                </Button>
              </a>
            </Link>
          </div>
        ) : (
          <p className="dark:text-slate-100">
            <Trans>This account hasn't created any projects yet.</Trans>
          </p>
        )}
      </span>
    )

  return <ProjectsList projects={myProjects} />
}

export function AccountDashboard({
  address,
  ensName,
  profile,
}: {
  address: string
  ensName: string | null
  profile: Profile | null
}) {
  const wallet = useWallet()
  const supabase = useSupabaseClient()
  const router = useRouter()

  const [editProfileButtonLoading, setEditProfileButtonLoading] =
    useState(false)

  const onEditProfileClicked = useCallback(async () => {
    setEditProfileButtonLoading(true)
    if (wallet.chainUnsupported) {
      const walletChanged = await wallet.changeNetworks()
      if (!walletChanged) {
        console.error('Wallet did not change network')
        setEditProfileButtonLoading(false)
        return
      }
    }
    if (!wallet.signer || !wallet.userAddress) {
      console.error('Wallet not connected')
      setEditProfileButtonLoading(false)
      return
    }

    const { data } = await supabase.auth.getSession()
    if (data.session) {
      await router.push(`/account/${wallet.userAddress}/edit`)
      return
    }

    try {
      const challengeMessage = await AuthAPI.getChallengeMessage({
        wallet: wallet.userAddress,
      })
      const signature = await wallet.signer.signMessage(challengeMessage)
      const accessToken = await AuthAPI.walletSignIn({
        wallet: wallet.userAddress,
        signature,
        message: challengeMessage,
      })
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: v4(), // Set to garbage token, no long lived tokens
      })
      if (error) throw error

      await router.push(`/account/${wallet.userAddress}/edit`)
    } catch (e) {
      console.error('Error occurred while signing in', e)
    } finally {
      setEditProfileButtonLoading(false)
    }
  }, [router, supabase.auth, wallet])

  const items = [
    {
      label: t`Activity`,
      key: 'activity',
      children: <ActivityList caller={address} />,
    },
    {
      label: t`Contributions`,
      key: 'holding',
      children: <ContributedList address={address} />,
    },
    {
      label: t`Projects created`,
      key: 'created',
      children: <MyProjectsList address={address} />,
    },
  ]

  const isOwner = wallet.userAddress?.toLowerCase() === address.toLowerCase()

  return (
    <div className="my-0 mx-auto max-w-5xl p-5">
      <header className="mb-10">
        <div className="flex flex-wrap items-start justify-between">
          <div className="mb-5 flex">
            <ProjectLogo
              uri={ensAvatarUrlForAddress(address, { size: 128 })}
              name={ensName ?? undefined}
              className="mr-5 h-32 w-32 rounded-full"
            />
            <div className="flex flex-col gap-2">
              <h1 className="mb-0 text-4xl text-black dark:text-slate-100">
                {ensName ?? <FormattedAddress address={address} />}
              </h1>
              {ensName && (
                <EtherscanLink
                  type="address"
                  value={truncateEthAddress({ address })}
                  className="text-grey-500 dark:text-slate-100"
                />
              )}
              <SocialLinks
                infoUri={profile?.website ?? undefined}
                twitter={profile?.twitter ?? undefined}
              />
            </div>
          </div>
          {isOwner && (
            <Button
              loading={editProfileButtonLoading}
              icon={<SettingOutlined />}
              onClick={onEditProfileClicked}
            >
              <span>
                <Trans>Edit profile</Trans>
              </span>
            </Button>
          )}
        </div>
        {profile?.bio && (
          <Paragraph description={profile.bio} characterLimit={250} />
        )}
      </header>

      <Tabs items={items} />
    </div>
  )
}
