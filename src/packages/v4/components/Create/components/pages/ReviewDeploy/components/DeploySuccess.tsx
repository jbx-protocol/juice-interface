import { ShareAltOutlined, TwitterOutlined } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { JB_CHAINS } from 'juice-sdk-core'
import { JBChainId } from 'juice-sdk-react'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import V4ProjectHandleLink from 'packages/v4/components/V4ProjectHandleLink'
import { v4ProjectRoute } from 'packages/v4/utils/routes'
import { useMemo, useState } from 'react'
import DeploySuccessHero from '/public/assets/images/create-success-hero.webp'

const NEW_DEPLOY_QUERY_PARAM = 'np'

export const DeploySuccess = ({
  projectIds,
}: {
  projectIds: { chainId: JBChainId; projectId: number }[]
}) => {
  const router = useRouter()
  const deployGreeting = t`Your project was successfully created!`

  const [gotoProjectClicked, setGotoProjectClicked] = useState<boolean>(false)

  /**
   * Generate a twitter share link based on the first project id, whatever it is.
   */
  const twitterShareUrl = useMemo(() => {
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
      <div className="mt-4 text-lg font-normal text-grey-600 dark:text-slate-200">
        {deployGreeting}
      </div>
      <div>
        {projectIds.map((project, index) => {
          const chain = JB_CHAINS[project.chainId]
          return (
            <div key={index} className="flex items-center justify-center">
              <div className="text-lg font-normal text-grey-600 dark:text-slate-200">
                <V4ProjectHandleLink projectId={project.projectId} chainId={project.chainId} />
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
