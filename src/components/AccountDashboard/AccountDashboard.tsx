import { SettingOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Button, Tabs } from 'antd'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import Grid from 'components/Grid'
import Loading from 'components/Loading'
import ProjectCard, { ProjectCardProject } from 'components/ProjectCard'
import ProjectLogo from 'components/ProjectLogo'
import { useContributedProjectsQuery, useMyProjectsQuery } from 'hooks/Projects'
import { useWallet } from 'hooks/Wallet'
import { AuthAPI } from 'lib/api/auth'
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
}: {
  address: string
  ensName?: string | null
}) {
  const wallet = useWallet()
  const supabase = useSupabaseClient()
  const router = useRouter()

  const [settingsButtonLoading, setSettingsButtonLoading] = useState(false)

  const onSettingsClicked = useCallback(async () => {
    setSettingsButtonLoading(true)
    if (wallet.chainUnsupported) {
      const walletChanged = await wallet.changeNetworks()
      if (!walletChanged) {
        console.error('Wallet did not change network')
        setSettingsButtonLoading(false)
        return
      }
    }
    if (!wallet.signer || !wallet.userAddress) {
      console.error('Wallet not connected')
      setSettingsButtonLoading(false)
      return
    }

    const { data } = await supabase.auth.getSession()
    if (data.session) {
      await router.push(`/account/${wallet.userAddress}/settings`)
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

      await router.push(`/account/${wallet.userAddress}/settings`)
    } catch (e) {
      console.error('Error occurred while signing in', e)
    } finally {
      setSettingsButtonLoading(false)
    }
  }, [router, supabase.auth, wallet])

  const items = [
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
      <header className="flex flex-wrap items-start justify-between">
        <div className="mb-10 flex">
          <ProjectLogo
            uri={ensAvatarUrlForAddress(address, { size: 128 })}
            name={ensName ?? undefined}
            className="mr-5 h-32 w-32"
          />
          <div>
            <h1 className="mb-2 text-4xl text-black dark:text-slate-100">
              {ensName ?? <FormattedAddress address={address} />}
            </h1>
            {ensName && (
              <span>
                <EtherscanLink
                  type="address"
                  value={truncateEthAddress({ address })}
                  className="text-grey-500 dark:text-slate-100"
                />
              </span>
            )}
          </div>
        </div>

        {isOwner && (
          <Button
            loading={settingsButtonLoading}
            icon={<SettingOutlined />}
            onClick={onSettingsClicked}
          >
            <span>
              <Trans>Settings</Trans>
            </span>
          </Button>
        )}
      </header>

      <Tabs items={items} />
    </div>
  )
}
