import Script from 'next/script'

export function QwestiveScript() {
  return (
    <>
      <Script src="https://qwestive-referral-dev.web.app/qwestiveCallback.js" />
      <Script
        id="qwestiveTracker"
        async
        defer
        src="https://qwestive-referral-dev.web.app/qwestive_sdk.js"
      />
      <Script
        id="embedUI"
        async
        defer
        project-key="qwest-qwestive.referral-dev"
        campaign-id="YmyatbFoiK6ZMBZ25JPK"
        src="https://qwestive-referral-dev.web.app/embed_ui_sdk.js"
      />
    </>
  )
}
