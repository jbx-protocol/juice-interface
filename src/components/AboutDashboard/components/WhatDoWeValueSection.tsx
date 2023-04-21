import { Trans, t } from '@lingui/macro'
import { twMerge } from 'tailwind-merge'
import { SectionContainer } from './SectionContainer'

export const WhatDoWeValueSection = () => {
  return (
    <SectionContainer className="text-center md:py-24">
      <h2 className="text-3xl md:text-4xl">
        <Trans>What do we value?</Trans>
      </h2>

      <div className="mt-12 flex flex-wrap gap-8 md:mt-16 md:grid md:grid-cols-3">
        <ValueBox
          className="bg-melon-400 dark:bg-melon-500"
          title={t`Trust`}
          description={t`Everything we do is to ensure that Juicebox is trustworthy.`}
        />
        <ValueBox
          className="bg-peel-400"
          title={t`Transparency`}
          description={t`We do everything in the light, for everyone to see.`}
        />
        <ValueBox
          className="bg-grape-400"
          title={t`Reliability`}
          description={t`A platform you can rely on, 100% of the time.`}
        />
        <ValueBox
          className="bg-crush-400 dark:bg-crush-500"
          title={t`Fun`}
          description={t`Making it fun & exciting to discover, launch and manage projects.`}
        />
        <ValueBox
          className="bg-bluebs-400"
          title={t`Community`}
          description={t`Juicebox is built for the people, by the people.`}
        />
        <ValueBox
          className="bg-split-400"
          title={t`Customization`}
          description={t`A platform without limits, just the way you like it.`}
        />
      </div>
    </SectionContainer>
  )
}

const ValueBox = ({
  className,
  title,
  description,
}: {
  className?: string
  title: string
  description: string
}) => {
  return (
    <div
      className={twMerge(
        'flex w-full flex-col gap-2 rounded-lg py-8 px-5 text-center text-black',
        className,
      )}
    >
      <div className="font-heading text-2xl font-medium">{title}</div>
      <div className="text-sm">{description}</div>
    </div>
  )
}
