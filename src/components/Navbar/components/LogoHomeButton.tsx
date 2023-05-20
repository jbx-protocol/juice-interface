import Logo from 'components/Logo'
import Link from 'next/link'

export const LogoHomeButton = () => (
  <Link href="/">
    <a>
      <Logo />
    </a>
  </Link>
)
