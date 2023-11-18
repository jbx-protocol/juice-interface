import { Trans } from '@lingui/macro'
import { CaseStudiesHeader } from 'components/CaseStudies/CaseStudiesHeader'
import { CaseStudyContentContainer } from 'components/CaseStudies/CaseStudyContentContainer'
import { CaseStudyPageWrapper } from 'components/CaseStudies/CaseStudyPageWrapper'
import ExternalLink from 'components/ExternalLink'
import SectionHeader from 'components/SectionHeader'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import {
  CASE_STUDY_PROJECTS,
  CONSTITUTION_FUNDING_CONFIG,
} from 'constants/successStoryProjects'
import Image from 'next/image'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function ConstitutionDAOPage() {
  const constitutionSuccessStoryProject = CASE_STUDY_PROJECTS[0]

  return (
    <AppWrapper>
      <CaseStudyPageWrapper>
        <CaseStudiesHeader
          header="/assets/images/case-studies/constitution-casestudy-banner.png"
          title="ConstitutionDAO"
          subtitle={
            <Trans>
              How a group of friends on the internet raised over $46 million to
              buy the U.S. Constitution
            </Trans>
          }
          totalRaised={11613}
          totalPayments={19121}
          summary={
            <Trans>
              ConstitutionDAO was a single purpose acquisition DAO that raised
              over $46 million in an attempt to buy one of the thirteen
              remaining copies of the U.S. Constitution at Sotheby's on November
              18th, 2021. What started as a joke in a group chat soon became a
              viral sensation with tens of thousands joining the Discord and
              contributing ETH to the project. Through their campaign,
              ConstitutionDAO gave the world a glimpse of the power of
              blockchains, decentralization, and community ownership.
            </Trans>
          }
          projectUrl="/p/constitutiondao"
          fundingConfig={CONSTITUTION_FUNDING_CONFIG()}
        />
        <CaseStudyContentContainer
          currentProject={constitutionSuccessStoryProject.id}
        >
          <p>
            <Trans>
              With an auction estimate of $10-15 million at Sotheby's,
              ConstitutionDAO wanted to raise as much as possible and decided to
              set Payouts to Unlimited. In order to build trust with potential
              supporters, the campaign set up a 9/13 multisig with core team
              members and well-known figures in web3. Reserved Rate was also set
              to 0 to guarantee that everyone had equal access to PEOPLE tokens
              which would govern the document if they won the auction.
            </Trans>
          </p>

          <Image
            src="/assets/images/case-studies/constitution-casestudy-banner2.png"
            alt="The Gang Buys the Constitution"
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
                ConstitutionDAO raised over $46 million in less than a week with
                over 19,000 payments made to the project. They were the second
                highest bidder on Sotheby's Lot 1787 and were unfortunately
                outbid by hedge fund billionaire Ken Griffin. Shortly following
                the auction, the core team set the Redemption Rate to 100% to
                allow all supporters to redeem their tokens and get their money
                back.
              </Trans>
            </p>
          </div>
          <div>
            <SectionHeader text={<Trans>Conclusion</Trans>} />
            <p>
              <Trans>
                Even though ConstitutionDAO lost the auction, they onboarded
                thousands to crypto with a powerful vision of collectively
                owning an important piece of U.S. history. This historical
                document meant different things to different people, but using
                Juicebox they were able to pool resources and work together
                towards a common goal. To learn more about the ConstitutionDAO
                story, listen to episode 15, 16, and 17 of the Juicebox podcast:{' '}
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
