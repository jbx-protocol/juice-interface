import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import Image from 'next/legacy/image'
import Link from 'next/link'
import { SectionContainer } from '../SectionContainer'
import { TickIconList } from './TickIconList'

export function ConclusionSection() {
  return (
    <SectionContainer className="max-w-7xl">
      <div className="flex flex-col-reverse items-center gap-12 md:flex-row md:gap-24">
        <div className="mx-auto w-full max-w-[480px]">
          <Image
            src={'/assets/images/juice-homepage-hero.webp'}
            alt={'Banny leaning on a stack of ETH coins'}
            width={480}
            height={480}
          />
        </div>
        <div>
          <div className="flex h-full flex-col justify-center">
            <h2 className="text-4xl">
              <Trans>Join 1,000+ projects growing with Juicebox</Trans>
            </h2>

            <TickIconList />

            <div className="mt-5 flex flex-col flex-wrap gap-2 md:flex-row">
              <Link href="/contact">
                <a className="w-full lg:w-auto">
                  <Button type="default" size="large" className="w-full">
                    <Trans>Contact onboarding</Trans>
                  </Button>
                </a>
              </Link>

              <Link href="/create">
                <a className="w-full lg:w-auto">
                  <Button className="w-full" size="large" type="primary">
                    <Trans>Create a project</Trans>
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
