import { Trans } from '@lingui/macro'
import Image from 'next/image'
import { JoinOurDiscordButton } from './JoinOurDiscordButton'
import { SectionContainer } from './SectionContainer'
import illustration from '/public/assets/images/about/illustration3.webp'

export const JuiceboxDaoSection = () => {
  return (
    <SectionContainer className="md:flex md:items-center md:justify-between md:text-start">
      <div className="md:w-1/2">
        <h2 className="text-3xl md:text-4xl">Juicebox DAO</h2>
        <p className="m-0 text-base text-grey-700 dark:text-slate-200 md:text-lg">
          <Trans>
            JuiceboxDAO is a community of passionate builders, creators, and
            innovators working together to push the boundaries of decentralized
            funding. Using the Juicebox protocol, we've created a DAO to
            coordinate thousands of JBX holders, build in the open, and govern
            the protocol over time.
          </Trans>
        </p>

        {/* Hack to get around antd bullshit where element a extends past button */}
        <div className="block w-min">
          <JoinOurDiscordButton className="mt-8" />
        </div>
      </div>

      <div className="mx-auto mt-14 w-full max-w-sm md:order-1 md:mx-0 md:mt-0">
        <Image
          src={illustration}
          alt="Banny and the crew gettin' lit in the Juicebox DAO band"
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>
    </SectionContainer>
  )
}
