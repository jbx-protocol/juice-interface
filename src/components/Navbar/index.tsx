import useMobile from 'hooks/Mobile'
import { TopLeftNavItems } from './MenuItems'
import MobileCollapse from './Mobile/MobileCollapse'

export default function Navbar() {
  const isMobile = useMobile()
  const desktop = !isMobile

  if (isMobile) return <MobileCollapse />

  return <TopLeftNavItems desktop={desktop} />
}
