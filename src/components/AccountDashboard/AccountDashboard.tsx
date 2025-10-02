import { SettingOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Tabs } from 'antd'
import ActivityListAnyV from 'components/ActivityListAnyV'
import { SocialButton } from 'components/buttons/SocialButton'
import EthereumAddress from 'components/EthereumAddress'
import Grid from 'components/Grid'
import { Etherscan } from 'components/icons/Etherscan'
import Loading from 'components/Loading'
import Paragraph from 'components/Paragraph'
import ProjectCard from 'components/ProjectCard'
import WalletContributionCard from 'components/WalletContributionCard'
import { PV_V4 } from 'constants/pv'
import { BigNumber } from 'ethers'
import { useWalletContributionsQuery } from 'generated/graphql'
import { useWalletContributionsQuery as useV4V5WalletContributionsQuery } from 'generated/v4v5/graphql'
import { useDBProjectsAggregateQuery } from 'hooks/useDBProjects'
import useMobile from 'hooks/useMobile'
import {
  useWalletBookmarkedIds,
  useWalletBookmarkedProjects,
} from 'hooks/useWalletBookmarkedProjects'
import { useWalletSignIn } from 'hooks/useWalletSignIn'
import { useWallet } from 'hooks/Wallet'
import { bendystrawClient } from 'lib/apollo/bendystrawClient'
import { client } from 'lib/apollo/client'
import { Profile } from 'models/database'
import { DBProjectsAggregate } from 'models/dbProject'
import Link from 'next/link'
import { useRouter } from 'next/router'
import SocialLinks from 'packages/v1/components/V1Project/V1ProjectHeader/SocialLinks'
import { useCallback, useState } from 'react'
import { isEqualAddress } from 'utils/address'
import { ensAvatarUrlForAddress } from 'utils/ens'
import { etherscanLink } from 'utils/etherscan'

function ProjectsList({ projects }: { projects: DBProjectsAggregate[] }) {
  const { userAddress } = useWallet()

  const { ids: bookmarkedProjectIds } = useWalletBookmarkedIds({
    wallet: userAddress,
  })

  return (
    <Grid>
      {projects?.map(p => (
        <ProjectCard
          project={p}
          key={p.id}
          bookmarked={bookmarkedProjectIds.has(p.id)}
        />
      ))}
    </Grid>
  )
}

function ContributedList({ address }: { address: string }) {
  const { data: participants, loading: contributionsLoading } =
    useWalletContributionsQuery({
      client,
      variables: {
        wallet: address.toLowerCase(),
        first: 1000,
      },
    })

  const { data: v4Participants } = useV4V5WalletContributionsQuery({
    client: bendystrawClient,
    variables: {
      address,
    },
  })

  const contributions = [
    ...(participants?.participants ?? []),
    ...(v4Participants?.participants.items
      .filter(p => !!p.project)
      .map(p => ({
        ...p,
        pv: PV_V4,
        volume: BigNumber.from(p.volume),
        project: p.project!, // for typing non-null
      })) ?? []),
  ]
    // auto sort by lastPaidTimestamp, desc. we can't dynamically sort because we must aggregate two lists
    .sort((a, b) => (a.lastPaidTimestamp > b.lastPaidTimestamp ? -1 : 1))

  const { userAddress } = useWallet()

  if (contributionsLoading) return <Loading />

  if (!contributions || contributions.length === 0)
    return (
      <span>
        {address === userAddress ? (
          <div>
            <p className="mb-5 dark:text-slate-100">
              <Trans>You haven't contributed to any projects yet!</Trans>
            </p>
            <Link href="/projects">
              <Button type="primary">
                <Trans>Explore projects</Trans>
              </Button>
            </Link>
          </div>
        ) : (
          <p className="dark:text-slate-100">
            <Trans>This account hasn't contributed to any projects yet.</Trans>
          </p>
        )}
      </span>
    )

  return (
    <div>
      <Grid>
        {contributions?.map(c => (
          <WalletContributionCard contribution={c} key={c.project.id} />
        ))}
      </Grid>
    </div>
  )
}

function OwnedProjectsList({ address }: { address: string }) {
  const { data: projects, isLoading } = useDBProjectsAggregateQuery({
    owner: address,
    orderBy: 'created_at',
    orderDirection: 'desc',
  })

  const { userAddress } = useWallet()

  if (isLoading) return <Loading />

  if (!projects || projects.length === 0)
    return (
      <span>
        {address === userAddress ? (
          <div>
            <p className="mb-5 dark:text-slate-100">
              <Trans>You don't own any projects.</Trans>
            </p>

            <Link href="/create">
              <Button type="primary">
                <Trans>Create project</Trans>
              </Button>
            </Link>
          </div>
        ) : (
          <p className="dark:text-slate-100">
            <Trans>This account doesn't own any projects yet.</Trans>
          </p>
        )}
      </span>
    )

  return <ProjectsList projects={projects} />
}

function SavedProjectsList({ address }: { address: string }) {
  const { data: projects, isLoading } = useWalletBookmarkedProjects({
    wallet: address,
  })

  const { userAddress } = useWallet()

  if (isLoading) return <Loading />

  if (!projects || projects.length === 0)
    return (
      <span>
        {address === userAddress ? (
          <p className="mb-5 dark:text-slate-100">
            <Trans>You haven't saved any projects.</Trans>
          </p>
        ) : (
          <p className="dark:text-slate-100">
            <Trans>This account hasn't saved any projects yet.</Trans>
          </p>
        )}
      </span>
    )

  return <ProjectsList projects={projects} />
}

function CreatedProjectsList({ address }: { address: string }) {
  const { data: projects, isLoading } = useDBProjectsAggregateQuery({
    creator: address,
  })

  const { userAddress } = useWallet()

  if (isLoading) return <Loading />

  if (!projects || projects.length === 0)
    return (
      <span>
        {address === userAddress ? (
          <div>
            <p className="mb-5 dark:text-slate-100">
              <Trans>You haven't created any projects yet!</Trans>
            </p>

            <Link href="/create">
              <Button type="primary">
                <Trans>Create project</Trans>
              </Button>
            </Link>
          </div>
        ) : (
          <p className="dark:text-slate-100">
            <Trans>This account hasn't created any projects yet.</Trans>
          </p>
        )}
      </span>
    )

  return <ProjectsList projects={projects} />
}

export function AccountDashboard({
  address,
  ensName,
  profile,
}: {
  address: string
  ensName: string | null | undefined
  profile: Profile | null | undefined
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
      label: t`Activity`,
      key: 'activity',
      children: <ActivityListAnyV from={address} />,
    },
    {
      label: t`Contributions`,
      key: 'holding',
      children: <ContributedList address={address} />,
    },
    {
      label: t`Saved projects`,
      key: 'saved',
      children: <SavedProjectsList address={address} />,
    },
    {
      label: t`Projects owned`,
      key: 'owned',
      children: <OwnedProjectsList address={address} />,
    },
    {
      label: t`Projects created`,
      key: 'created',
      children: <CreatedProjectsList address={address} />,
    },
  ]

  const isOwner = isEqualAddress(wallet.userAddress, address.toLowerCase())

  return (
    <div className="my-0 mx-auto max-w-5xl p-5">
      <header className="mb-10">
        <div className="flex flex-wrap items-start justify-between">
          <div className="mb-5 flex">
            <div className="mr-5 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-smoke-100 text-4xl dark:bg-slate-700">
              <img
                className="h-full w-full object-cover object-center"
                src={ensAvatarUrlForAddress(address, { size: 128 * 2 })}
                alt={address + ' avatar'}
                crossOrigin="anonymous"
                title={address}
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="mb-0 font-heading text-4xl font-medium text-black dark:text-slate-100">
                {ensName ?? <EthereumAddress address={address} />}
              </h1>
              {ensName && (
                <EthereumAddress
                  ensDisabled
                  address={address}
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
                <Trans>Settings</Trans>
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
