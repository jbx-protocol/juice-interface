import Script from 'next/script'

export function QwestiveScript() {
  return (
    <>
      <Script src="https://qwestive-referral-prod.web.app/qwestiveCallback.js" />
      <Script
        id="qwestiveTracker"
        async
        defer
        src="https://qwestive-referral-prod.web.app/qwestive_sdk.js"
      />
      <Script
        id="embedUI"
        async
        defer
        project-key="juicebox.referral"
        campaign-id="hJCUZVJIodVP6Ki6MP6e"
        src="https://qwestive-referral-prod.web.app/embed_ui_sdk.js"
      />
    </>
  )
}
