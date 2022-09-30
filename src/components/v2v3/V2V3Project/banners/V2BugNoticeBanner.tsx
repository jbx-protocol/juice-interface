import Banner from '../../../Banner'
import ExternalLink from '../../../ExternalLink'

export function V2BugNoticeBanner() {
  // This copy has not been prepped for translations due to being a hot fix that is likely to change.
  return (
    <Banner
      variant="warning"
      title="Payments disabled."
      body={
        <>
          <p>
            This project uses an old version of the V2 Juicebox protocol
            contracts. This version of the contracts contains a minor bug.{' '}
            <strong>No funds are in danger</strong> and projects are unlikely to
            be affected.{' '}
            <ExternalLink href="https://github.com/jbx-protocol/juice-contracts-v2/blob/main/security/postmortem/5.24.2022.md">
              Read the postmortem.
            </ExternalLink>
          </p>
          <p>
            Payments to V2 projects with a 0 treasury balance have been
            disabled. To re-enable payments, this project's owner must re-launch
            their funding cycle using the updated version of the V2 Juicebox
            contracts.
          </p>
        </>
      }
    ></Banner>
  )
}
