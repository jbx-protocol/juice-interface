import Script from 'next/script'

export function FathomScript() {
  return (
    <Script
      id="fathom-script"
      strategy="afterInteractive"
      src="https://learned-hearty.juicebox.money/script.js"
      data-site="ERYRRJSV"
      defer
    />
  )
}
