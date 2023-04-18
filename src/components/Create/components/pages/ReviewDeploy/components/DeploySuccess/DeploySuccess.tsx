import { ShareAltOutlined, TwitterOutlined } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { NEW_DEPLOY_QUERY_PARAM } from 'components/v2v3/V2V3Project/modals/NewDeployModal'
import { readNetwork } from 'constants/networks'
import { useWallet } from 'hooks/Wallet'
import { NetworkName } from 'models/networkName'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'

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
      <Image src="/assets/images/dancing.gif" width={218} height={218} />
      <div className="pt-8 text-4xl font-medium">Congratulations!</div>
      <div className="mt-6 text-xl font-normal">{deployGreeting}</div>
      <div className="flex flex-col gap-2 py-12">
        <Button
          type="primary"
          onClick={handleGoToProject}
          loading={gotoProjectClicked}
        >
          <span>
            <Trans>Go to project</Trans>
          </span>
        </Button>
        <ExternalLink href={twitterShareUrl}>
          <Button icon={<TwitterOutlined />}>
            <span>
              <Trans> Share on Twitter</Trans>
            </span>
          </Button>
        </ExternalLink>
        <ExternalLink href="https://discord.gg/juicebox">
          <Button icon={<ShareAltOutlined />}>
            <span>
              <Trans> Share to JuiceboxDAO</Trans>
            </span>
          </Button>
        </ExternalLink>
      </div>
    </div>
  )
}
