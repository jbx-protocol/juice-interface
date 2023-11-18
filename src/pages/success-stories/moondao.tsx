import { Trans } from '@lingui/macro'
import { CaseStudiesHeader } from 'components/CaseStudies/CaseStudiesHeader'
import { CaseStudyContentContainer } from 'components/CaseStudies/CaseStudyContentContainer'
import { CaseStudyPageWrapper } from 'components/CaseStudies/CaseStudyPageWrapper'
import ExternalLink from 'components/ExternalLink'
import SectionHeader from 'components/SectionHeader'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import {
  CASE_STUDY_PROJECTS,
  MOONDAO_FUNDING_CONFIG,
} from 'constants/successStoryProjects'
import Image from 'next/image'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function MoonDAOPage() {
  const moonDAOSuccessStoryProject = CASE_STUDY_PROJECTS[1]

  return (
    <AppWrapper>
      <CaseStudyPageWrapper>
        <CaseStudiesHeader
          header="/assets/images/case-studies/moondao-casestudy-banner.png"
          title="MoonDAO"
          subtitle={
            <Trans>
              How a community of space enthusiasts raised $8.3 million to send a
              DAO member to space on a Blue Origin rocket
            </Trans>
          }
          totalRaised={2623.7}
          totalPayments={2677}
          summary={
            <Trans>
              MoonDAO is a worldwide collective united by the mission of
              decentralizing access to space research and exploration. With
              privatized space exploration on the rise, MoonDAO is uniting space
              enthusiasts from around the globe to help make it more accessible
              while continuing to push research forward. In 2021, they launched
              a campaign to buy two tickets on a Blue Origin rocket and raised
              over $8 million on Juicebox. A year later, they sent Coby Cotton
              from viral YouTube channel Dude Perfect to space as their first
              astronaut.
            </Trans>
          }
          projectUrl="/p/moondao"
          fundingConfig={MOONDAO_FUNDING_CONFIG()}
        />
        <CaseStudyContentContainer
          currentProject={moonDAOSuccessStoryProject.id}
        >
          <p>
            <Trans>
              Following the launch of their token $MOONEY, the next goal on
              MoonDAO's roadmap was to buy two tickets to space on a Blue Origin
              rocket. They set the project's Payouts to Infinite in order to
              raise as much as possible during their campaign and be able to
              distribute all of the funds. Using a reserved rate of 50%, the
              MoonDAO multi-sig received half of all newly minted tokens to
              build up a treasury of both ETH and $MOONEY that could later be
              used for bounties and compensation.
            </Trans>
          </p>

          <Image
            src="/assets/images/case-studies/moondao-casestudy-banner2.png"
            alt="MoonDAO one small step"
            width={592}
            height={256}
            className="pb-5"
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
          <div>
            <SectionHeader text={<Trans>Success</Trans>} />
            <p>
              <Trans>
                MoonDAO has built an enthusiastic community of over 10,000
                members, successfully sent their first astronaut to space, and
                is currently coordinating the spaceflight for their second
                astronaut. Their ambitious long-term roadmap goals include
                building a settlement on the Moon by 2030. In collaboration with
                StudioDAO, a decentralized movie studio running on Juicebox,
                MoonDAO has donated $100,000 to help fund the production of
                Ticket To Space, the first DAO documentary. The film will cover
                the story of Yan, a MoonDAO member from China, who will be sent
                to space on an upcoming Blue Origin flight after minting a free
                NFT.
              </Trans>
            </p>
          </div>
          <div>
            <SectionHeader text={<Trans>Conclusion</Trans>} />
            <p>
              <Trans>
                Bringing together members from around the world with the help of
                blockchain technology and decentralized governance, MoonDAO has
                demonstrated that sometimes setting ambitious and even
                outlandish goals can pay off when they resonate with your
                audience. Their unique mission goes beyond memes, though, and
                taps into a deeper human curiosity about what might exist beyond
                planet Earth. To learn more about the story of MoonDAO, listen
                to co-founders Pablo and Kori on episode 7 of the Juicebox
                podcast:{' '}
                <ExternalLink href="https://podcast.juicebox.money">
                  https://podcast.juicebox.money
                </ExternalLink>
                .
              </Trans>
            </p>
          </div>
        </CaseStudyContentContainer>
      </CaseStudyPageWrapper>
    </AppWrapper>
  )
}

export const getServerSideProps = globalGetServerSideProps
