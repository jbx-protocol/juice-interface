import Script from 'next/script'

export function QwestiveScript() {
  return (
    <>
      <Script
        src="https://qwestive-referral-prod.web.app/qwestiveCallback.js"
        strategy="beforeInteractive"
      />
      <Script
        id="qwestiveTracker"
        strategy="afterInteractive"
        src="https://qwestive-referral-prod.web.app/qwestive_sdk.js"
      />
      <Script
        id="embedUI"
        strategy="afterInteractive"
        project-key="juicebox.referral"
        campaign-id="hJCUZVJIodVP6Ki6MP6e"
        src="https://qwestive-referral-prod.web.app/embed_ui_sdk.js"
      />
    </>
  )
}
