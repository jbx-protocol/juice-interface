import Logo from 'components/Logo'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const LogoHomeButton = () => {
  const router = useRouter()
  const isHomePage = router.pathname === '/'
  
  return (
    <Link href="/" className={isHomePage ? '' : '-ml-2'}>
      <Logo iconOnly={!isHomePage} />
    </Link>
  )
}
