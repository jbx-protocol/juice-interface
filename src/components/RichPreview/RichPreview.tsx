import DOMPurify from 'dompurify'
import { ipfsUriToGatewayUrl } from 'utils/ipfs'

export const RichPreview = ({ source }: { source: string }) => {
  // Convert ipfs:// URLs to gateway URLs before sanitization
  const processedSource = source.replace(
    /src="ipfs:\/\/([^"]+)"/g,
    (match, cid) => `src="${ipfsUriToGatewayUrl(`ipfs://${cid}`)}"`
  )

  const purified = DOMPurify.sanitize(processedSource)

  return (
    <div
      id="rich-text"
      className="break-words"
      dangerouslySetInnerHTML={{
        __html: purified,
      }}
    />
  )
}
