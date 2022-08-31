import { VFC } from 'react'

import { SEO } from '../SEO'

export const Head: VFC = () => {
  return (
    <SEO>
      <meta
        key="viewport"
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <meta name="theme-color" content="#000000" />

      <link rel="apple-touch-icon" href="/assets/juice_logo-ol.png" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <script
        async
        src="/vendor/desmos/calculator.min.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
      ></script>

      {process.env.NODE_ENV === 'production' && (
        <script
          src="https://learned-hearty.juicebox.money/script.js"
          data-site="ERYRRJSV"
          defer
        ></script>
      )}
      {process.env.NODE_ENV === 'production' && (
        <script
          defer
          dangerouslySetInnerHTML={{
            __html: `
    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:3077427,hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  `,
          }}
        ></script>
      )}
    </SEO>
  )
}
