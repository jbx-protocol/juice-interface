import { DownOutlined, MenuOutlined } from '@ant-design/icons'
import { Menu } from '@headlessui/react'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { useWallet } from 'hooks/Wallet'
import Link from 'next/link'
import { BrandUpdateBanner } from '../BrandUpdateBanner'
import Logo from '../Logo'
import NavLanguageSelector from '../NavLanguageSelector'
import WalletButton from '../WalletButton'
import ThemePickerMobile from './ThemePickerMobile'

export default function MobileNavigation() {
  const { isConnected, disconnect } = useWallet()

  return (
    <div className="fixed z-10 w-full">
      <BrandUpdateBanner />
      <Menu className="bg-l0 p-4" as="nav">
        <div className="flex items-center justify-between">
          <LogoHomeButton />
          <HamburgerMenuButton />
        </div>
        <Menu.Items className="stroke-tertiary flex flex-col gap-5 border border-x-0 border-t-0 border-solid pt-8 pb-4">
          {/* Main site links */}
          <div className="flex flex-col gap-4 px-6">
            <Menu.Item>
              <Link href="/projects">
                <a className="text-primary">
                  <Trans>Explore</Trans>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="/create">
                <a className="text-primary">
                  <Trans>Create a project</Trans>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <ExternalLink
                className="text-primary"
                href="https://discord.gg/wFTh4QnDzk"
              >
                <Trans>Discord</Trans>
              </ExternalLink>
            </Menu.Item>
            <Menu.Item>
              <ResourcesMenu />
            </Menu.Item>
          </div>

          {/* Selectors and toggles */}
          <div className="flex flex-col gap-4 px-6">
            <Menu.Item>
              <NavLanguageSelector />
            </Menu.Item>
            <Menu.Item>
              <ThemePickerMobile />
            </Menu.Item>
          </div>

          {/* Wallet interaction */}
          <div className="flex flex-col gap-2">
            <Menu.Item>
              <WalletButton />
            </Menu.Item>
            {isConnected && (
              <Menu.Item>
                <Button onClick={disconnect} block>
                  <Trans>Disconnect</Trans>
                </Button>
              </Menu.Item>
            )}
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

const HamburgerMenuButton = () => (
  <Menu.Button as="div">
    <MenuOutlined
      className="text-2xl leading-none text-black dark:text-slate-100"
      role="button"
    />
  </Menu.Button>
)

const ResourcesMenu = () => {
  return (
    <Menu>
      <div>
        <Menu.Button
          as="div"
          className="text-primary flex justify-between font-medium"
        >
          <Trans>Resources</Trans>
          <DownOutlined />
        </Menu.Button>

        <Menu.Items className="flex flex-col gap-4 px-6 pt-4">
          <Menu.Item>
            <ExternalLink
              className="text-primary"
              href="https://docs.juicebox.money/"
            >
              <Trans>Docs</Trans>
            </ExternalLink>
          </Menu.Item>
          <Menu.Item>
            <ExternalLink
              className="text-primary"
              href="https://newsletter.juicebox.money/"
            >
              <Trans>Newsletter</Trans>
            </ExternalLink>
          </Menu.Item>
          <Menu.Item>
            <ExternalLink
              className="text-primary"
              href="https://podcast.juicebox.money/"
            >
              <Trans>Podcast</Trans>
            </ExternalLink>
          </Menu.Item>
          <Menu.Item>
            <Link href="/contact">
              <a className="text-primary">
                <Trans>Contact</Trans>
              </a>
            </Link>
          </Menu.Item>
        </Menu.Items>
      </div>
    </Menu>
  )
}
