import { SettingOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Tabs } from 'antd'
import { Badge } from 'components/Badge'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import Grid from 'components/Grid'
import { Etherscan } from 'components/icons/Etherscan'
import Loading from 'components/Loading'
import Paragraph from 'components/Paragraph'
import SocialLinks from 'components/Project/ProjectHeader/SocialLinks'
import ProjectCard, { ProjectCardProject } from 'components/ProjectCard'
import ProjectLogo from 'components/ProjectLogo'
import { SocialButton } from 'components/SocialButton'
import useMobile from 'hooks/Mobile'
import { useContributedProjectsQuery, useMyProjectsQuery } from 'hooks/Projects'
import { useWallet } from 'hooks/Wallet'
import { useWalletSignIn } from 'hooks/WalletSignIn'
import { Profile } from 'models/database'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { ensAvatarUrlForAddress } from 'utils/ens'
import { etherscanLink } from 'utils/etherscan'

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
  const signIn = useWalletSignIn()
  const router = useRouter()

  const [editProfileButtonLoading, setEditProfileButtonLoading] =
    useState(false)

  const onEditProfileClicked = useCallback(async () => {
    setEditProfileButtonLoading(true)
    try {
      await signIn()
      await router.push(`/account/${wallet.userAddress}/edit`)
    } catch (e) {
      console.error('Error occurred while signing in', e)
    } finally {
      setEditProfileButtonLoading(false)
    }
  }, [router, signIn, wallet.userAddress])

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
                  truncated
                  type="address"
                  value={address}
                  className="text-grey-500 dark:text-slate-100"
                />
              )}
              <div className="flex gap-3">
                <EtherscanSocialButton address={address} />
                <SocialLinks
                  infoUri={profile?.website ?? undefined}
                  twitter={profile?.twitter ?? undefined}
                  tooltipPlacement="bottom"
                />
              </div>
            </div>
          </div>
          {isOwner && (
            <Button
              loading={editProfileButtonLoading}
              icon={<SettingOutlined />}
              onClick={onEditProfileClicked}
            >
              <span className="inline-flex gap-3">
                <Trans>Edit profile</Trans> <Badge variant="info">Beta</Badge>
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

const EtherscanSocialButton = ({ address }: { address: string }) => {
  const isMobile = useMobile()

  return (
    <SocialButton
      link={etherscanLink('address', address)}
      tooltip="Etherscan"
      tooltipPlacement={'bottom'}
    >
      <Etherscan size={isMobile ? 16 : 14} />
    </SocialButton>
  )
}
