import Script from 'next/script'

export function FathomScript() {
  return (
    <Script
      id="fathom-script"
      strategy="afterInteractive"
      src="https://cdn.usefathom.com/script.js"
      data-site="ERYRRJSV"
      defer
    />
  )
}
