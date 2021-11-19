import { Helmet } from 'react-helmet'
import { ProjectMetadataV3 } from 'models/project-metadata'

const DEFAULT_METADATA: ProjectMetadataV3 = {
  name: 'Juicebox',
  twitter: 'juiceboxETH',
  description: 'Community funding for people and projects on Ethereum.',
  logoUri:
    'https://jbx.mypinata.cloud/ipfs/QmQYomY5sFvG96FKy3BKFU7mmcSiJsRjSHURmJSMPHrALJ',
}

const ProjectMetadata = ({
  metadata = DEFAULT_METADATA,
}: {
  metadata?: ProjectMetadataV3
}) => {
  const isDefault = metadata.name === DEFAULT_METADATA.name

  return (
    <Helmet>
      <title>{metadata.name}</title>
      <meta
        property="og:url"
        content={!isDefault ? window.location.href : 'https://juicebox.money'}
      />
      <meta property="og:title" content={metadata.name} />
      <meta name="description" content={metadata.description} />
      <link
        rel="search"
        type="application/opensearchdescription+xml"
        href="/opensearch.xml"
        title="Juicebox"
      ></link>
      {metadata.twitter && <meta name="twitter:site" content={`@${metadata.twitter}`} />}
      {metadata.twitter && <meta name="twitter:creator" content={`@${metadata.twitter}`} />}
      {metadata.twitter && <meta name="twitter:card" content="summary_large_image" />}
      <meta name="twitter:title" content={metadata.name} />
      {metadata.description && <meta name="twitter:description" content={metadata.description} />}
      {metadata.logoUri && <meta property="og:image" content={metadata.logoUri} />}
      {metadata.description && <meta property="og:image:alt" content={metadata.description} />}
      <meta property="og:image:width" content={!isDefault ? '1020' : '2870'} />
      <meta property="og:image:height" content={!isDefault ? '1020' : '1245'} />
      <meta property="og:site_name" content="Juicebox" />
      <meta property="og:type" content="object" />
      <meta property="og:title" content={metadata.name} />
      {metadata.description && <meta property="og:description" content={metadata.description} />}
      {<meta name="twitter:image" content={metadata.logoUri} />}
    </Helmet>
  )
}

export default ProjectMetadata
