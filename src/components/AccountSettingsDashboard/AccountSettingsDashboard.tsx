import { LeftOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Tab } from '@headlessui/react'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import { User } from 'models/database'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { NotificationsTab } from './components/NotificationsTab'
import { ProfileDetailsTab } from './components/ProfileDetailsTab'

export const AccountSettingsDashboard = ({ user }: { user: User }) => {
  const [minimized, setMinimized] = useState(false)
  const toggleMinimized = () => setMinimized(!minimized)
  const minimize = () => setMinimized(true)

  const tabs = useMemo(
    () => [
      {
        name: t`Profile details`,
        component: <ProfileDetailsTab user={user} />,
      },
      { name: t`Notifications`, component: <NotificationsTab /> },
    ],
    [user],
  )

  return (
    <div className="mx-auto flex max-w-5xl flex-col p-5">
      <SettingsMenuButton className="md:hidden" onClick={toggleMinimized} />

      <div className="flex">
        <Tab.Group onChange={minimize}>
          <Tab.List
            className={twMerge(
              'absolute z-[5] flex h-full w-0 flex-col space-y-1 overflow-auto bg-white py-4 transition-all duration-200 ease-in-out dark:bg-slate-800',
              'md:static md:flex md:w-1/4 md:min-w-[1/4] md:overflow-visible md:p-4',
              minimized ? '' : 'w-1/2 px-4',
            )}
          >
            <BackToAccountButton
              className="text-start"
              walletAddress={user.wallet}
            />
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  `text-primary rounded-lg border-0 px-4 py-2 text-left transition-colors duration-200 ${
                    selected
                      ? 'bg-smoke-100 font-medium dark:bg-slate-500'
                      : 'text-gray-700 cursor-pointer bg-transparent hover:bg-smoke-100 dark:hover:bg-slate-500'
                  }`
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels
            className={twMerge(
              'w-full',
              'md:ml-1/4',
              minimized ? 'md:w-full' : 'md:w-3/4',
            )}
          >
            {tabs.map((tab, index) => (
              <Tab.Panel key={index} className="p-8">
                {tab.component}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}

const SettingsMenuButton = ({
  className,
  onClick,
}: {
  className?: string
  onClick: () => void
}) => (
  <div
    className={twMerge(
      'text-primary cursor-pointer px-4 py-2 text-left text-2xl leading-none',
      className,
    )}
    onClick={onClick}
  >
    <UnorderedListOutlined />
  </div>
)

const BackToAccountButton = ({
  className,
  walletAddress,
}: {
  className?: string
  walletAddress: string
}) => (
  <Link href={`/account/${walletAddress}`} legacyBehavior>
    <Button
      className={className}
      type="link"
      icon={<LeftOutlined />}
      size="small"
    >
      <Trans>Back to profile</Trans>
    </Button>
  </Link>
)
