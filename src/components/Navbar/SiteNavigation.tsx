import { Menu } from '@headlessui/react'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import QuickProjectSearch from 'components/QuickProjectSearch'
import useMobile from 'hooks/Mobile'
import { useWallet } from 'hooks/Wallet'
import Link from 'next/link'
import { DropdownMenu } from './components/DropdownMenu'
import { HamburgerMenuButton } from './components/HamburgerMenuButton'
import { LogoHomeButton } from './components/LogoHomeButton'
import NavLanguageSelector from './components/NavLanguageSelector'
import ThemePicker from './components/ThemePicker'
import ThemePickerMobile from './components/ThemePickerMobile'
import WalletButton from './components/Wallet/WalletButton'

export default function SiteNavigation() {
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
