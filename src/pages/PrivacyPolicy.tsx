import ExternalLink from '../components/shared/ExternalLink'

export default function PrivacyPolicy() {
  return (
    <div style={{ padding: '40px', maxWidth: '1080px', margin: '0 auto' }}>
      <h1>Privacy Policy</h1>
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
    </div>
  )
}
