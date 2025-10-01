import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { JBChainId } from 'juice-sdk-react'
import Image from 'next/legacy/image'
import DeploySuccessHero from '/public/assets/images/create-success-hero.webp'

export const SafeQueueSuccess = ({
  chains,
}: {
  chains: JBChainId[]
}) => {

  return (
    <div className="mt-4 flex flex-col items-center justify-center text-center">
      <Image
        alt="Project transactions queued successfully image"
        src={DeploySuccessHero}
        width={380}
        height={380}
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
      <div className="pt-4 font-display text-5xl font-bold">
        <Trans>Congratulations!</Trans>
      </div>
      <div className="my-4 text-lg font-normal text-grey-600 dark:text-slate-200">
        <Trans>Your project launch transactions have been queued to your Safe wallet!</Trans>
      </div>
      
      <div className="mb-6 max-w-lg text-sm text-grey-500 dark:text-slate-300">
        <Trans>
          Your project launch transactions are now waiting for execution in your Safe wallet.
          Once the required signatures are collected, you can execute them through the Safe interface.
        </Trans>
      </div>

      <div className="mt-6 flex justify-center">
        <ExternalLink href="https://discord.gg/juicebox">
          <Button
            type="text"
            className="text-bluebs-500 hover:text-bluebs-400"
          >
            <span>
              <Trans>Get help in JuiceboxDAO Discord</Trans>
            </span>
          </Button>
        </ExternalLink>
      </div>
    </div>
  )
}
