import { Trans, t } from '@lingui/macro'
import { CaseStudiesConfigurationProps } from 'components/CaseStudies/CaseStudiesConfiguration'
import { CaseStudiesHeader } from 'components/CaseStudies/CaseStudiesHeader'
import { CaseStudyContentContainer } from 'components/CaseStudies/CaseStudyContentContainer'
import ExternalLink from 'components/ExternalLink'
import SectionHeader from 'components/SectionHeader'
import { AppWrapper } from 'components/common'
import { CASE_STUDY_PROJECTS } from 'constants/successStoryProjects'
import Image from 'next/image'

export default function ConstitutionDAOPage() {
  const constitutionSuccessStoryProject = CASE_STUDY_PROJECTS[0]

  const fundingConfig: CaseStudiesConfigurationProps = {
    cycleNumber: 1,
    cycles: t`Unlocked`,
    payouts: t`Unlimited`,
    tokenName: 'PEOPLE',
    tokenIssuanceRate: '1,000,000',
    reservedRate: 0,
    issuanceReductionRate: 0,
    redemptionRate: 100,
    ownerTokenMinting: false,
    editDeadline: t`No deadline`,
  }

  return (
    <AppWrapper>
      <CaseStudiesHeader
        header="/assets/constitution-casestudy-banner.png"
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
            over $40M in an attempt to buy one of the last thirteen remaining
            copies of the U.S. Constitution at Sotheby’s on November 18th, 2021.
            What started as a joke in a group chat became a viral internet
            sensation. Thousands were onboarded into crypto as a result and the
            fundraiser gave the world a glimpse of the power of blockchain
            technology, decentralization, and new forms of governance.
          </Trans>
        }
        projectUrl="/p/constitutiondao"
        fundingConfig={fundingConfig}
      />
      <CaseStudyContentContainer
        currentProject={constitutionSuccessStoryProject}
      >
        <p>
          <Trans>
            With an auction estimate of $10-15 million at Sotheby’s,
            ConstitutionDAO wanted to raise as much as possible and decided to
            set Payouts to Unlimited. In order to build trust with potential
            supporters, the campaign set up a 9/13 multisig with core team
            members and well-known figures in web3. Reserved Rate was also set
            to 0 to guarantee that everyone had equal access to PEOPLE tokens
            which would govern the document if they won the auction.
          </Trans>
        </p>

        <Image
          src="/assets/constitution-casestudy-banner2.png"
          alt="The Gang Buys the Constitution"
          width={592}
          height={256}
          className="pb-5"
        />
        <div>
          <SectionHeader text={t`Success`} />
          <p>
            <Trans>
              ConstitutionDAO raised over $46 million in less than a week with
              over 19,000 payments made to the project. They were the second
              highest bidder on Sotheby’s Lot 1787 and were unfortunately outbid
              by hedge fund billionaire Ken Griffin. Shortly following the
              auction, the core team set the Redemption Rate to 100% to allow
              all supporters to redeem their tokens and get their money back.
            </Trans>
          </p>
        </div>
        <div>
          <SectionHeader text={t`Conclusion`} />
          <p>
            <Trans>
              Even though ConstitutionDAO lost the auction, they onboarded
              thousands to crypto with a powerful vision of collectively owning
              an important piece of U.S. history. This historical document meant
              different things to different people, but using Juicebox they were
              able to pool resources and work together towards a common goal. To
              learn more about the ConstitutionDAO story, listen to episode 15,
              16, and 17 of the Juicebox podcast:{' '}
              <ExternalLink href="https://podcast.juicebox.money">
                https://podcast.juicebox.money
              </ExternalLink>
              .
            </Trans>
          </p>
        </div>
      </CaseStudyContentContainer>
    </AppWrapper>
  )
}
