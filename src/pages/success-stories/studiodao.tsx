import { Trans } from '@lingui/macro'
import { CaseStudiesHeader } from 'components/CaseStudies/CaseStudiesHeader'
import { CaseStudyContentContainer } from 'components/CaseStudies/CaseStudyContentContainer'
import { CaseStudyPageWrapper } from 'components/CaseStudies/CaseStudyPageWrapper'
import ExternalLink from 'components/ExternalLink'
import SectionHeader from 'components/SectionHeader'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import {
  CASE_STUDY_PROJECTS,
  STUDIODAO_FUNDING_CONFIG,
} from 'constants/successStoryProjects'
import Image from 'next/image'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function StudioDAOPage() {
  const studioDAOSuccessStoryProject = CASE_STUDY_PROJECTS[3]

  return (
    <AppWrapper>
      <CaseStudyPageWrapper>
        <CaseStudiesHeader
          header="/assets/images/case-studies/studiodao-casestudy-banner.png"
          title="StudioDAO"
          subtitle={
            <Trans>
              How StudioDAO is building the first million person movie studio on
              Juicebox.
            </Trans>
          }
          totalRaised={44.53}
          totalPayments={96}
          summary={
            <Trans>
              StudioDAO is a decentralized movie studio flipping the script on
              how films get funded. By combining the power of collective action
              with NFTs tied to programmable treasuries, StudioDAO gives
              audiences a platform to vote on which films they want to fund and
              watch while giving filmmakers new opportunities to get their
              projects funded.
            </Trans>
          }
          projectUrl="/@studiodao"
          fundingConfig={STUDIODAO_FUNDING_CONFIG()}
        />
        <CaseStudyContentContainer
          currentProject={studioDAOSuccessStoryProject.id}
        >
          <p>
            <Trans>
              StudioDAO's project settings are designed to maximize trust with
              locked 28-day cycles, limited payouts, and a 3-day edit deadline.
              20% of newly minted tokens are reserved for the DAO wallet and
              issuance will decrease by 5% each cycle. StudioDAO also leverages
              tiered NFT rewards to create incentives for supporters with
              benefits like private screenings, governance votes to decide which
              new films to fund, and screen credits.
            </Trans>
          </p>

          <Image
            src="/assets/images/case-studies/studiodao-casestudy-banner2.png"
            alt="StudioDAO Banner 2"
            width={592}
            height={592}
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
                Since launching in November 2022 StudioDAO has raised nearly 50
                ETH and is gearing up to launch their first film *Ticket to
                Space*, the first DAO documentary about MoonDAO sending DAO
                member Yan Kejun to space on a Blue Origin rocket. MoonDAO has
                recently voted to donate $100,000 to help fund the film's
                production. To learn more about the Ticket to Space documentary,
                listen to episode 22 of the Juicebox podcast featuring a
                roundtable discussion with director Fernando Urdapilleta,
                producer Susie Conley, MoonDAO co-founder Pablo
                Moncada-Larrotiz, and StudioDAO co-founders Kenny Miller and
                Rachel Leventhal:{' '}
                <ExternalLink href="https://podcast.juicebox.money">
                  https://podcast.juicebox.money
                </ExternalLink>
                .
              </Trans>
            </p>
          </div>
          <div>
            <SectionHeader text={<Trans>Conclusion</Trans>} />
            <p>
              <Trans>
                Using crowdfunding platforms for films has been around for a
                while, but Juicebox adds an extra layer of transparency to the
                process, allowing fans to see where funds are going. Unlike
                traditional models where money is controlled behind the scenes,
                StudioDAO members source, vote, fund, and distribute movies
                transparently using the treasury while creators retain 100% of
                their creative control and ownership. With the entertainment
                market currently valued at two trillion dollars, StudioDAO
                founder Kenny Miller can see a “clear scenario for a
                decentralized studio to do one billion dollars of production 2-3
                years from now.” To learn more about Kenny's vision for
                StudioDAO, listen to episode 9 of the Juicecast:{' '}
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
