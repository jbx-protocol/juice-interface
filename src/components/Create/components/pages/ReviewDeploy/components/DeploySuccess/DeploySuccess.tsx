import { ShareAltOutlined, TwitterOutlined } from '@ant-design/icons'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { XLButton } from 'components/buttons/XLButton'
import { readNetwork } from 'constants/networks'
import { useWallet } from 'hooks/Wallet'
import { NetworkName } from 'models/networkName'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import DeploySuccessHero from '/public/assets/images/create-success-hero.webp'

const NEW_DEPLOY_QUERY_PARAM = 'np'

export const DeploySuccess = ({ projectId }: { projectId: number }) => {
  console.info('Deploy: SUCCESS', projectId)
  const router = useRouter()
  const { chain } = useWallet()
  let deployGreeting = t`Your project was successfully created!`
  if (chain?.name) {
    deployGreeting = t`Your project was successfully created on ${chain.name}!`
  }

  const [gotoProjectClicked, setGotoProjectClicked] = useState<boolean>(false)

  /**
   * Generate a twitter share link based on the project id.
   */
  const twitterShareUrl = useMemo(() => {
    const juiceboxUrl =
      readNetwork.name === NetworkName.mainnet
        ? `https://juicebox.money/v2/p/${projectId}`
        : `https://${readNetwork.name}.juicebox.money/v2/p/${projectId}`

    const message = `Check out my project on ${
      chain?.name ? `${chain.name} ` : ''
    }Juicebox!\n${juiceboxUrl}`
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      message,
    )}`
  }, [chain, projectId])

  const handleGoToProject = useCallback(() => {
    setGotoProjectClicked(true)
    router.push(
      `/v2/p/${projectId}?${NEW_DEPLOY_QUERY_PARAM}=1`,
      `/v2/p/${projectId}`,
    )
  }, [projectId, router])

  return (
    <div className="mt-4 flex flex-col items-center justify-center text-center">
      <Image
        alt="Project created successfully image"
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
      <div className="mt-4 text-lg font-normal text-grey-600 dark:text-slate-200">
        {deployGreeting}
      </div>
      <XLButton
        type="primary"
        onClick={handleGoToProject}
        loading={gotoProjectClicked}
        className="mt-8 flex w-auto items-center gap-3 text-white"
      >
        <span className="text-base">
          <Trans>Go to project</Trans>
        </span>
        <span>
          <ArrowRightIcon className="h-6 w-6" />
        </span>
      </XLButton>
      <div className="mt-6 flex justify-between">
        <ExternalLink href={twitterShareUrl}>
          <Button
            icon={<TwitterOutlined />}
            type="text"
            className="text-bluebs-500 hover:text-bluebs-400"
          >
            <span>
              <Trans>Share on Twitter</Trans>
            </span>
          </Button>
        </ExternalLink>
        <ExternalLink href="https://discord.gg/juicebox">
          <Button
            icon={<ShareAltOutlined />}
            type="text"
            className="text-bluebs-500 hover:text-bluebs-400"
          >
            <span>
              <Trans>Share to JuiceboxDAO</Trans>
            </span>
          </Button>
        </ExternalLink>
      </div>
    </div>
  )
}
