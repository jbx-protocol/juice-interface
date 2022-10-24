import useMobile from 'hooks/Mobile'
import DesktopNavigation from './DeskTopNavigation'
import MobileCollapse from './Mobile/MobileCollapse'

export default function Navbar() {
  const isMobile = useMobile()
  const desktop = !isMobile

  if (isMobile) return <MobileCollapse />

  return <DesktopNavigation desktop={desktop} />
}
