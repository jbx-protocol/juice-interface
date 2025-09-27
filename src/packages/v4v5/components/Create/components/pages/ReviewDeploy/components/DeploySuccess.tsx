import { ShareAltOutlined, TwitterOutlined } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { JB_CHAINS } from 'juice-sdk-core'
import { JBChainId } from 'juice-sdk-react'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import V4V5ProjectHandleLink from 'packages/v4v5/components/V4V5ProjectHandleLink'
import { v4ProjectRoute } from 'packages/v4v5/utils/routes'
import { useMemo } from 'react'
import DeploySuccessHero from '/public/assets/images/create-success-hero.webp'

const NEW_DEPLOY_QUERY_PARAM = 'np'

export const DeploySuccess = ({
  projectIds,
}: {
  projectIds: { chainId: JBChainId; projectId: number }[]
}) => {
  const router = useRouter()
  const deployGreeting = t`Your project was successfully created!`

  /**
   * Generate a twitter share link based on the first project id, whatever it is.
   */
  const twitterShareUrl = useMemo(() => {
    if (!projectIds || projectIds.length === 0) {
      return ''
    }
    const juiceboxUrl = v4ProjectRoute(projectIds[0])
    const chain = JB_CHAINS[projectIds[0].chainId]

    const message = `Check out my project on ${
      chain?.name ? `${chain.name} ` : ''
    }Juicebox!\n${juiceboxUrl}`
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      message,
    )}`
  }, [projectIds])

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
      <div className="my-4 text-lg font-normal text-grey-600 dark:text-slate-200">
        {deployGreeting}
      </div>
      <div className="flex flex-col gap-2 rounded border px-6 py-4 dark:border-slate-300">
        {projectIds.map((project, index) => {
          return (
            <div key={index} className="flex items-center">
              <div className="text-base font-normal text-grey-600 dark:text-slate-200">
                <V4V5ProjectHandleLink
                  projectId={project.projectId}
                  chainId={project.chainId}
                />
              </div>
            </div>
          )
        })}
      </div>

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
