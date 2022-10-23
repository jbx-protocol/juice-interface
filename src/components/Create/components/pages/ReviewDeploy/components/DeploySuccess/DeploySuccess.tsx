import { ShareAltOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { NEW_DEPLOY_QUERY_PARAM } from 'components/v2v3/V2V3Project/modals/NewDeployModal'
import { useWallet } from 'hooks/Wallet'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'

export const DeploySuccess = ({ projectId }: { projectId: number }) => {
  console.info('Deploy: SUCCESS', projectId)
  const router = useRouter()
  const { chain } = useWallet()
  let deployGreeting = t`Your project has successfully launched!`
  if (chain?.name) {
    deployGreeting = t`Your project has successfully launched on ${chain.name}!`
  }

  /**
   * Generate a twitter share link based on the project id.
   */
  const twitterShareUrl = useMemo(() => {
    let juiceboxUrl = `https://juicebox.money/v2/p/${projectId}`
    const chainId = chain?.name.toLowerCase() ?? 'mainnet'
    if (chainId !== 'mainnet') {
      juiceboxUrl = `https://${chainId}.juicebox.money/v2/p/${projectId}`
    }
    const message = `Check out my project on ${
      chain?.name ? `${chain.name} ` : ''
    }Juicebox!\n${juiceboxUrl}`
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      message,
    )}`
  }, [chain, projectId])

  const handleGoToProject = useCallback(() => {
    router.push(
      `/v2/p/${projectId}?${NEW_DEPLOY_QUERY_PARAM}=1`,
      `/v2/p/${projectId}`,
    )
  }, [projectId, router])

  return (
    <div
      style={{
        height: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image src="/assets/dancing.gif" width={218} height={218} />
      <div
        style={{
          paddingTop: '30px',
          fontWeight: 500,
          fontSize: '38px',
          lineHeight: '24px',
        }}
      >
        Congratulations!
      </div>
      <div
        style={{
          marginTop: '1.5rem',
          fontWeight: 400,
          fontSize: '18px',
          lineHeight: '34px',
        }}
      >
        {deployGreeting}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '4rem' }}>
        <ExternalLink href={twitterShareUrl}>
          <Button>
            {/* Spacing is weird when you use button icon - do this instead */}
            <Space>
              <ShareAltOutlined />
              <Trans> Share project</Trans>
            </Space>
          </Button>
        </ExternalLink>
        <Button type="primary" onClick={handleGoToProject}>
          <Trans>Go to project</Trans>
        </Button>
      </div>
    </div>
  )
}
