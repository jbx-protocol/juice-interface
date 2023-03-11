import Script from 'next/script'
/**
 * Loads qwestiveCallback.js: qwestive callback script using beforeInteractive strategy
 * to make sure, we know when respective scripts are loaded and when it is safe to call init method
 * exposed by the respective script
 *
 * Loads qwestive_sdk.js: qwestive tracker sdk to track invitee's events like page_load
 * and loggin in using a specific referral link as part of Juicebox referral program
 *
 * Loads embed_ui_sdk.js: qwestive embed ui sdk to embed referral program ui into juicebox app
 * as a widget which can be used by referrers/affiliates to track their referrals right from
 * juicebox app
 */
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
