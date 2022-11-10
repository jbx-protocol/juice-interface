import Script from 'next/script'

export function DesmosScript() {
  return (
    <Script
      async
      src="/vendor/desmos/calculator.min.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
    ></Script>
  )
}
