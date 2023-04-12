import { Trans } from '@lingui/macro'
import Image from 'next/image'
import { formatAmount } from 'utils/format/formatAmount'
import { SectionContainer } from './SectionContainer'
import juiceHero from '/public/assets/juice-homepage-hero.webp'

export const OurMissionSection = () => {
  return (
    <SectionContainer className="md:flex md:items-center md:justify-between md:gap-24 md:text-start">
      <div className="md:w-1/2">
        <h2 className="font-header text-4xl">
          <Trans>Our mission</Trans>
        </h2>
        <p>
          <Trans>
            To connect 1,000,000 creators to 100,000,000 contributors to raise
            $1,000,000,000, whilst putting Juicebox into the hands of our
            community - sharing our success with the people that matter.
          </Trans>
        </p>

        <ProgressBar
          className="py-8"
          currentAmount={500687764}
          maxAmount={1000000000}
        />
      </div>

      <div className="mx-auto w-80 max-w-xs md:mx-0">
        <Image
          src={juiceHero}
          alt="Banny the chill Juicebox banana drinking juice"
          priority
        />
      </div>
    </SectionContainer>
  )
}

interface ProgressBarProps {
  className?: string
  currentAmount: number
  maxAmount: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  currentAmount,
  maxAmount,
}) => {
  const percentage = (currentAmount / maxAmount) * 100

  return (
    <div className={className}>
      <div className="relative mb-6">
        <div className="flex items-center gap-3">
          <span className="text-base font-medium md:text-lg">$0</span>

          {/* Progress bar */}
          <div className="relative h-3 w-full rounded-full bg-split-100 dark:bg-slate-400">
            <div
              className="h-full rounded-full bg-split-400"
              style={{ width: `${percentage}%` }}
            />

            {/* Tooltip bubble */}
            <div
              // Add a soft shadow to the tooltip bubble
              className="absolute bottom-full mb-2 flex -translate-x-1/2 flex-col items-center"
              style={{
                left: `${percentage}%`,
              }}
            >
              <div className="bg-l0 rounded-lg bg-white py-2 px-3 shadow-md dark:bg-slate-900">
                <Trans>We are here</Trans>
              </div>
              <div className="h-0 w-0 border-4 border-b-0 border-transparent border-t-white shadow-md dark:border-t-slate-900" />
            </div>

            {/* Underneath current number */}
            <div
              className="absolute top-full mt-2 -translate-x-1/2"
              style={{
                left: `${percentage}%`,
              }}
            >
              <span className="text-secondary text-xs">
                ${formatAmount(currentAmount)}
              </span>
            </div>
          </div>

          <span className="text-base font-medium md:text-lg">
            ${Math.floor(maxAmount / 1e9)}B
          </span>
        </div>
      </div>
    </div>
  )
}
