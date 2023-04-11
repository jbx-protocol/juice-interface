import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import useMobile from 'hooks/Mobile'
import Link from 'next/link'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { TrendingCarousel } from './TrendingCarousel'

export function TopSection() {
  const isMobile = useMobile()

  return (
    <SectionContainer>
      <SectionHeading
        heading={t`Fund your thing`}
        subheading={
          <Trans>
            Join thousands of projects using Juicebox to fund, operate, and
            scale their ideas & communities transparently on Ethereum.
          </Trans>
        }
        className="text-5xl md:text-7xl"
      />
      <div className="mb-10 flex w-full justify-center">
        <Link href="/create">
          <a>
            <Button size="large" type="primary" block={isMobile}>
              <Trans>Create a project</Trans>
            </Button>
          </a>
        </Link>
      </div>
      <TrendingCarousel />
    </SectionContainer>
  )
}
