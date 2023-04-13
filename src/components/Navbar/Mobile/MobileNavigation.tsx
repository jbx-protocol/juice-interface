import { DownOutlined, MenuOutlined } from '@ant-design/icons'
import { Menu, Transition } from '@headlessui/react'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import QuickProjectSearch from 'components/QuickProjectSearch'
import useMobile from 'hooks/Mobile'
import { useWallet } from 'hooks/Wallet'
import Link from 'next/link'
import { Fragment } from 'react'
import Logo from '../../Logo'
import NavLanguageSelector from '../components/NavLanguageSelector'
import ThemePicker from '../components/ThemePicker'
import WalletButton from '../components/Wallet/WalletButton'
import ThemePickerMobile from './ThemePickerMobile'

export default function MobileNavigation() {
  const isMobile = useMobile()
  const { isConnected, disconnect } = useWallet()

  return (
    <div className="fixed z-10 w-full md:static md:px-4 xl:px-12">
      <Menu
        className="bg-l0 p-4 md:flex md:items-center md:gap-10 md:px-0 md:py-6"
        as="nav"
      >
        <div className="flex items-center justify-between md:inline-flex">
          <LogoHomeButton />
          <HamburgerMenuButton className="md:hidden" />
        </div>
        <Menu.Items
          static={!isMobile}
          className="stroke-tertiary flex flex-col gap-5 border-b pt-8 pb-4 md:inline-flex md:w-full md:min-w-0 md:flex-row md:items-center md:justify-between md:border-b-0 md:p-0"
        >
          {/* Main site links */}
          <div className="flex flex-col gap-4 px-6 md:min-w-0 md:flex-shrink md:flex-row md:gap-10 md:px-0">
            {isMobile && (
              <Menu.Item>
                <Link href="/">
                  <a className="text-primary font-medium">
                    <Trans>Home</Trans>
                  </a>
                </Link>
              </Menu.Item>
            )}
            <Menu.Item>
              <ExploreMenu />
            </Menu.Item>
            <Menu.Item>
              <ResourcesMenu />
            </Menu.Item>
            <Menu.Item>
              <Link href="/create">
                <a className="text-primary font-medium md:min-w-0 md:max-w-xs md:truncate">
                  <Trans>Create a project</Trans>
                </a>
              </Link>
            </Menu.Item>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            {/* Selectors and toggles */}
            <div className="flex flex-col gap-4 px-6 md:flex-row md:items-center md:gap-6 md:px-0">
              <Menu.Item>
                <NavLanguageSelector />
              </Menu.Item>
              <Menu.Item>
                {isMobile ? <ThemePickerMobile /> : <ThemePicker />}
              </Menu.Item>
            </div>

            {/* Wallet interaction */}
            <div className="flex flex-col gap-2 md:items-center">
              <Menu.Item>
                <WalletButton />
              </Menu.Item>
              {isConnected && (
                <Menu.Item>
                  <Button
                    className="flex justify-center"
                    onClick={disconnect}
                    block
                  >
                    <Trans>Disconnect</Trans>
                  </Button>
                </Menu.Item>
              )}
            </div>
            <QuickProjectSearch className="md:hidden xl:inline" />
          </div>
        </Menu.Items>
      </Menu>
    </div>
  )
}

const LogoHomeButton = () => (
  <Link href="/">
    <a>
      <Logo />
    </a>
  </Link>
)

const HamburgerMenuButton = ({ className }: { className?: string }) => (
  <Menu.Button className={className} as="div">
    <MenuOutlined
      className="text-2xl leading-none text-black dark:text-slate-100"
      role="button"
    />
  </Menu.Button>
)

const exploreMenuItems = [
  {
    label: t`Trending projects`,
    href: '/projects?tab=trending',
  },
  {
    label: t`Recently listed`,
    href: '/projects?tab=new',
  },
  {
    label: t`All projects`,
    href: '/projects?tab=all',
  },
]

const ExploreMenu = () => (
  <DropdownMenu items={exploreMenuItems} heading={t`Explore`} />
)

const resourcesMenuItems = [
  {
    label: t`Join our Discord`,
    href: 'https://discord.gg/wFTh4QnDzk',
    isExternal: true,
  },
  {
    label: t`JuiceboxDAO`,
    href: '/@juicebox',
  },
  {
    label: t`Docs`,
    href: 'https://docs.juicebox.money/',
    isExternal: true,
  },
  {
    label: t`Podcast`,
    href: 'https://podcast.juicebox.money/',
    isExternal: true,
  },
]

const ResourcesMenu = () => (
  <DropdownMenu items={resourcesMenuItems} heading={t`Resources`} />
)

const DropdownMenu = ({
  heading,
  items,
}: {
  heading: string
  items: { label: string; href: string; isExternal?: boolean }[]
}) => {
  return (
    <Menu>
      <div className="md:relative">
        <Menu.Button
          as="div"
          className={
            'text-primary flex cursor-pointer items-center justify-between font-medium hover:text-grey-500 dark:hover:text-slate-200 md:gap-1'
          }
        >
          {heading}
          <DownOutlined />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={
              'flex flex-col gap-4 px-6 pt-4 dark:bg-slate-800 md:absolute md:left-0 md:z-10 md:mt-2 md:gap-5 md:rounded-lg md:border md:border-grey-300 md:bg-white md:px-2.5 md:py-4 md:dark:border-slate-300'
            }
          >
            {items.map(item => (
              <Menu.Item key={item.href}>
                {item.isExternal ? (
                  <ExternalLink
                    className="text-primary md:whitespace-nowrap md:font-medium"
                    href={item.href}
                  >
                    {item.label}
                  </ExternalLink>
                ) : (
                  <Link href={item.href}>
                    <a className="text-primary md:whitespace-nowrap md:font-medium">
                      {item.label}
                    </a>
                  </Link>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  )
}
