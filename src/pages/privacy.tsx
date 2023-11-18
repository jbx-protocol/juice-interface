import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import ExternalLink from 'components/ExternalLink'
import Link from 'next/link'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function PrivacyPolicyPage() {
  return (
    <AppWrapper>
      <PrivacyPolicy />
    </AppWrapper>
  )
}

function PrivacyPolicy() {
  return (
    <div className="my-0 mx-auto max-w-5xl p-10">
      <h1 className="text-2xl">Privacy Policy</h1>
      <p>
        <Link href="/">juicebox.money</Link> uses{' '}
        <ExternalLink href="https://www.hotjar.com/">Hotjar</ExternalLink>, and{' '}
        <ExternalLink href="https://usefathom.com/">Fathom</ExternalLink> to
        collect and analyze user data.
      </p>
      <h2 className="text-2xl">Fathom</h2>
      <p>
        We want to process as little personal information as possible when you
        use our website. That's why we've chosen Fathom Analytics for our
        website analytics, which doesn't use cookies and complies with the GDPR,
        ePrivacy (including PECR), COPPA and CCPA. Using this privacy-friendly
        website analytics software, your IP address is only briefly processed,
        and we (running this website) have no way of identifying you. As per the
        CCPA, your personal information is de-identified. You can read more
        about this on{' '}
        <ExternalLink href="https://usefathom.com/">
          Fathom Analytics
        </ExternalLink>
        ' website.
      </p>
      <p>
        The purpose of us using this software is to understand our website
        traffic in the most privacy-friendly way possible so that we can
        continually improve our website and business. The lawful basis as per
        the GDPR is "where our legitimate interests are to improve our website
        and business continually." As per the explanation, no personal data is
        stored over time.
      </p>
      <h2 className="text-2xl">Hotjar</h2>
      <p>
        We use Hotjar in order to better understand our users' needs and to
        optimize this service and experience. Hotjar is a technology service
        that helps us better understand our users' experience (e.g. how much
        time they spend on which pages, which links they choose to click, what
        users do and don't like, etc.) and this enables us to build and maintain
        our service with user feedback. Hotjar uses cookies and other
        technologies to collect data on our users' behavior and their devices.
        This includes a device's IP address (processed during your session and
        stored in a de-identified form), device screen size, device type (unique
        device identifiers), browser information, geographic location (country
        only), and the preferred language used to display our website. Hotjar
        stores this information on our behalf in a pseudonymized user profile.
        Hotjar is contractually forbidden to sell any of the data collected on
        our behalf.
      </p>
    </div>
  )
}

export const getServerSideProps = globalGetServerSideProps
