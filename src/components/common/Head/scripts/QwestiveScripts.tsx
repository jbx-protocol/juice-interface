import Script from 'next/script'
/**
 * Loads qwestiveTrackerCallback.js: qwestive callback script using beforeInteractive strategy
 * to make sure, we know when respective scripts are loaded and when it is safe to call init method
 * exposed by the respective script
 *
 * Loads qwestive_sdk.js: qwestive tracker sdk to track invitee's events like page_load
 * and loggin in using a specific referral link as part of Juicebox referral program
 */
export function QwestiveScript() {
  return (
    <>
      <Script
        src="https://qwestive-referral-prod.web.app/qwestiveTrackerCallback.js"
        strategy="beforeInteractive"
      />
      <Script
        id="qwestiveTracker"
        strategy="afterInteractive"
        src="https://qwestive-referral-prod.web.app/qwestive_sdk.js"
      />
    </>
  )
}
