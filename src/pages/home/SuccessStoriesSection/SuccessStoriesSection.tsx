import { t, Trans } from '@lingui/macro'
import { Button, Row, Space } from 'antd'
import useMobile from 'hooks/Mobile'
import { useProjectsQuery } from 'hooks/Projects'
import Link from 'next/link'
import { DEFAULT_HOMEPAGE_GUTTER } from '../Landing'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { SuccessStoriesCard } from './SuccessStoriesCard'

export function SuccessStoriesSection() {
  const { data: topProjects } = useProjectsQuery({
    pageSize: 4,
  })
  const isMobile = useMobile()

  return (
    <SectionContainer>
      <SectionHeading
        heading={t`Success stories`}
        subheading={
          <Trans>
            Juicebox gives you the tools to automate web3 fundraising so you can
            focus on building. Join{' '}
            {/* <Link href='/projects?tab=all'>
              <a className='underline'>
                thousands of projects
              </a>
            </Link>{' '} */}
            sippin' the Juice.
          </Trans>
        }
      />
      <Row gutter={DEFAULT_HOMEPAGE_GUTTER}>
        {topProjects?.map(p => (
          <SuccessStoriesCard project={p} key={p.metadataUri} />
        ))}
      </Row>
      <div className="text-center">
        <Space direction="vertical" className="mt-16 w-full" size="large">
          {/* SOON WILL HAVE A LINK TO "CASE STUDIES" HERE */}
          <Link href="/create">
            <a>
              <Button size="large" type="primary" block={isMobile}>
                <Trans>Create a project</Trans>
              </Button>
            </a>
          </Link>
        </Space>
      </div>
    </SectionContainer>
  )
}
