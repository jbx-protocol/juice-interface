import Head from 'next/head'

export default function SEO({
  description,
  title,
  siteTitle,
}: {
  description: string
  title: string
  siteTitle: string
}) {
  return (
    <Head>
      <title>{`${title} | ${siteTitle}`}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:image" content="/assets/banana-cover.png" />
      <meta property="og:image:type" content="image/svg" />
      <meta property="og:image:width" content="2870" />
      <meta property="og:image:height" content="1245" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@juiceboxETH" />
      <meta name="twitter:creator" content="@juiceboxETH" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content="https://jbx.mypinata.cloud/ipfs/QmQYomY5sFvG96FKy3BKFU7mmcSiJsRjSHURmJSMPHrALJ"
      />
      <meta property="twitter:description" content={description} />

      <meta
        name="google-site-verification"
        content="0Jp7zERBL5i76DiM-bODvBGgbjuVMEQGSuwOchP_ZnE"
      />

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
    </Head>
  )
}
