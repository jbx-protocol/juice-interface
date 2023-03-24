import { InfoCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Col, Row, Tooltip } from 'antd'
import Grid from 'components/Grid'
import useMobile from 'hooks/Mobile'
import { useTrendingProjects } from 'hooks/Projects'
import Link from 'next/link'
import RankingExplanation from 'pages/projects/RankingExplanation'
import TrendingProjectCard from 'pages/projects/TrendingProjectCard'
import Payments from './Payments'

const TRENDING_PROJECTS_LIMIT = 6

export default function TrendingSection() {
  const isMobile = useMobile()

  const { data: trendingProjects } = useTrendingProjects(
    TRENDING_PROJECTS_LIMIT,
  )

  return (
    <section className="my-0 mx-auto py-12 px-5">
      <Row className="my-0 mx-auto max-w-5xl gap-y-10">
        <Col xs={24} md={12} className="px-0 md:px-10">
          <div className="flex flex-col gap-9">
            <h2 className="m-0 font-heading font-normal text-black dark:text-slate-100">
              <Trans>Trending projects</Trans>{' '}
              <Tooltip title={<RankingExplanation />} placement="bottom">
                <InfoCircleOutlined className="text-xl" />
              </Tooltip>
            </h2>

            <Grid list gutter={12}>
              {trendingProjects?.map((p, i) => (
                <TrendingProjectCard
                  project={p}
                  rank={i + 1}
                  key={`${p.id}_${p.pv}`}
                />
              ))}
            </Grid>

            <Link href="/projects">
              <a>
                <Button size="large" block={isMobile}>
                  <Trans>More trending projects</Trans>
                </Button>
              </a>
            </Link>
          </div>
        </Col>

        <Col xs={24} md={12} className="px-0 md:px-10">
          <div className="flex flex-col gap-9">
            <h2 className="m-0 font-heading font-normal text-black dark:text-slate-100">
              <Trans>Latest payments</Trans>
            </h2>
            <div className="max-h-[784px] overflow-auto">
              <Payments />
            </div>
          </div>
        </Col>
      </Row>
    </section>
  )
}
