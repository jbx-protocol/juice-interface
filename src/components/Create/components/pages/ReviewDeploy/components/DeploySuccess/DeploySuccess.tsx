import { ShareAltOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { NEW_DEPLOY_QUERY_PARAM } from 'components/v2v3/V2V3Project/modals/NewDeployModal'
import { MAINNET_CHAIN_ID, NETWORKS } from 'constants/networks'
import useMobile from 'hooks/Mobile'
import { useWallet } from 'hooks/Wallet'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { classNames } from 'utils/classNames'

export const DeploySuccess = ({ projectId }: { projectId: number }) => {
  console.info('Deploy: SUCCESS', projectId)
  const isMobile = useMobile()
  const router = useRouter()
  const { chain } = useWallet()
  let deployGreeting = t`Your project has successfully launched!`
  if (chain?.name) {
    deployGreeting = t`Your project has successfully launched on ${chain.name}!`
  }

  const [gotoProjectClicked, setGotoProjectClicked] = useState<boolean>(false)

  /**
   * Generate a twitter share link based on the project id.
   */
  const twitterShareUrl = useMemo(() => {
    let juiceboxUrl = `https://juicebox.money/v2/p/${projectId}`
    const chainId = parseInt(chain?.id ?? MAINNET_CHAIN_ID.toString())
    if (chainId !== MAINNET_CHAIN_ID) {
      juiceboxUrl = `https://${NETWORKS[chainId].name}.juicebox.money/v2/p/${projectId}`
    }
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
    <div
      className={classNames(
        'flex flex-col items-center justify-center text-center',
        isMobile ? 'mt-4' : 'mt-28',
      )}
    >
      <Image src="/assets/dancing.gif" width={218} height={218} />
      <div className="pt-8 text-4xl font-medium">Congratulations!</div>
      <div className="mt-6 text-xl font-normal">{deployGreeting}</div>
      <div className="flex gap-2 pt-16">
        <ExternalLink href={twitterShareUrl}>
          <Button>
            {/* Spacing is weird when you use button icon - do this instead */}
            <Space>
              <ShareAltOutlined />
              <Trans> Share project</Trans>
            </Space>
          </Button>
        </ExternalLink>
        <Button
          type="primary"
          onClick={handleGoToProject}
          loading={gotoProjectClicked}
        >
          <Trans>Go to project</Trans>
        </Button>
      </div>
    </div>
  )
}
