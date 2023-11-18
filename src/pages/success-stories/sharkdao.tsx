import { Trans } from '@lingui/macro'
import { CaseStudiesHeader } from 'components/CaseStudies/CaseStudiesHeader'
import { CaseStudyContentContainer } from 'components/CaseStudies/CaseStudyContentContainer'
import { CaseStudyPageWrapper } from 'components/CaseStudies/CaseStudyPageWrapper'
import ExternalLink from 'components/ExternalLink'
import SectionHeader from 'components/SectionHeader'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import {
  CASE_STUDY_PROJECTS,
  SHARKDAO_FUNDING_CONFIG,
} from 'constants/successStoryProjects'
import Image from 'next/image'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function SharkDAOPage() {
  const sharkDAOSuccessStoryProject = CASE_STUDY_PROJECTS[2]

  return (
    <AppWrapper>
      <CaseStudyPageWrapper>
        <CaseStudiesHeader
          header="/assets/images/case-studies/sharkdao-casestudy-banner.png"
          title="SharkDAO"
          subtitle={
            <Trans>
              How SharkDAO raised over 1,000 ETH to buy 6 Nouns NFTs and become
              the largest sub-DAO of Nouns DAO
            </Trans>
          }
          totalRaised={1019.2}
          totalPayments={1330}
          summary={
            <Trans>
              SharkDAO is a sub-DAO of Nouns DAO raising funds to participate in
              the Nouns ecosystem. Nouns is an on-chain generative NFT project
              with a daily auction of a 32x32 pixel character with heads that
              represent a noun like “moose,” “pylon,” or “banana.” SharkDAO
              brings together Nouns enthusiasts priced out of buying their own
              Noun with the shared goal of acquiring Nouns and contributing to
              the Nouns ecosystem. Since their launch in August 2021 SharkDAO
              has acquired 6 Nouns, put forward several successful proposals in
              Nouns DAO governance, and brought together over 900 nounish DAO
              members.
            </Trans>
          }
          projectUrl="/p/sharkdao"
          fundingConfig={SHARKDAO_FUNDING_CONFIG()}
        />
        <CaseStudyContentContainer
          currentProject={sharkDAOSuccessStoryProject.id}
        >
          <p>
            <Trans>
              With highly competitive auctions happening every 24 hours,
              SharkDAO's success was made possible through the flexibility of
              their Juicebox project settings. From cycle to cycle, SharkDAO
              enabled or disabled payments and adjusted $SHARK tokenomics (total
              issuance rate, reserved rate, and issuance reduction rate). With
              unlocked cycles and no edit deadline, they were able to make
              changes to their project quickly in response to upcoming Nouns
              auctions.
            </Trans>
          </p>

          <Image
            src="/assets/images/case-studies/sharkdao-casestudy-banner2.png"
            alt="SharkDAO Banner 2"
            width={592}
            height={311}
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
                Since their launch in August 2021, SharkDAO has raised over 1000
                ETH on Juicebox, acquired six Nouns, and brought together over
                900 members. They remain active nearly two years later
                collaborating with artists for NFT drops and working on
                governance in the Nouns ecosystem. NounsDAO has passed several
                SharkDAO proposals including{' '}
                <ExternalLink href="https://nouns.wtf/vote/20">
                  Nouns-based short films
                </ExternalLink>{' '}
                and{' '}
                <ExternalLink href="https://nouns.wtf/vote/8">
                  FOMO Nouns
                </ExternalLink>
                . SharkDAO has also{' '}
                <ExternalLink href="https://nouns.wtf/vote/104">
                  helped provide eye exams and glasses to thousands of kids in
                  need
                </ExternalLink>
                , donated 5 ETH to the{' '}
                <ExternalLink href="https://www.coralrestoration.org/crypto-donations/">
                  Coral Restoration Foundation
                </ExternalLink>
                , and started a{' '}
                <ExternalLink href="https://juicebox.money/#/p/sharkfrens">
                  Juicebox project
                </ExternalLink>{' '}
                which raised 60+ ETH for co-founder{' '}
                <ExternalLink href="https://twitter.com/iamDelPiero">
                  Del Piero
                </ExternalLink>
                's son's leukemia treatment.
              </Trans>
            </p>
          </div>
          <div>
            <SectionHeader text={<Trans>Conclusion</Trans>} />
            <p>
              <Trans>
                Through community ownership and pooling resources, SharkDAO
                offered a way for members to participate in the Nouns ecosystem
                despite the high barrier to entry. SharkDAO members can own as
                little as one $SHARK token and become an active voice in Nouns
                DAO governance through the sub-DAO. To learn more about the
                story of SharkDAO, listen to Dropnerd on episode 5 of the
                Juicebox podcast:{' '}
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
