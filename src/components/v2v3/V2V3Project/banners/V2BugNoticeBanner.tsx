import Banner from 'components/Banner'
import ExternalLink from 'components/ExternalLink'

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
            <ExternalLink
              className="text-black underline hover:text-haze-400 dark:text-smoke-200 dark:hover:text-haze-400"
              href="https://docs.juicebox.money/dev/resources/post-mortem/2022-05-24/"
            >
              Read the postmortem.
            </ExternalLink>
          </p>
          <p>
            Payments to V2 projects with a balance of 0 ETH have been disabled.
            To re-enable payments, this project's owner must re-launch their
            cycle using the updated version of the V2 Juicebox contracts.
          </p>
        </>
      }
    ></Banner>
  )
}
