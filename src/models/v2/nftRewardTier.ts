export type NftRewardTier = {
  // the following are guidelines on NFT keys and tier JSON, derivates from EIP-721, https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
  contributionFloor: number // attributes { trait_type: "Contribution floor", trait_value: contributionFloor }
  maxSupply: number // attrributes { trait_type: "Max supply", trait_value: maxSupply }
  name: string // name
  symbol: string | undefined // shouldPreferSymbol: false, symbol: name.slice(0, 6)
  description: string | undefined // description (A human readable description of the item. Markdown is supported.)
  imageUrl: string // image (This is the URL to the image of the item. Can be just about any type of image (including SVGs, which will be cached into PNGs by OpenSea), and can be IPFS URLs or paths.)
  imageDataUrl: string | undefined // image_data (Raw SVG image data, if you want to generate images on the fly (not recommended). Only use this if you're not including the image parameter.)
  artifactUri: string | undefined // artifactUri (optional, some legacy UX, wallets use this)
  animationUri: string | undefined // animation_uri (Animation_url also supports HTML pages, allowing you to build rich experiences and interactive NFTs using JavaScript canvas, WebGL, and more. Scripts and relative paths within the HTML page are now supported. However, access to browser extensions is not supported.)
  displayUri: string | undefined // displayUri (optional, some legacy UX, wallets use this)
  externalLink: string | undefined // external_uri (optional, This is the URL that will appear below the asset's image on OpenSea and will allow users to leave OpenSea and view the item on your site.)
  youtubeUri: string | undefined // youtube_uri (optional, A URL to a YouTube video.)
  backgroundColor: string | undefined // background_color, (optional, Background color of the item on OpenSea. Must be a six-character hexadecimal without a pre-pended #.)
  attributes: undefined // attributes, (optional, These are the attributes for the item, which will show up on the OpenSea page for the item. (see below))
}

/*

{
   "name": "Banny",
   "symbol": "Banny-0001",
   "shouldPreferSymbol": false,
   "description": "",
   "minter": "jbdao.eth",
   "decimals": 0,
   "creators": [
      "jbdao.eth"
   ],
   "publishers": [
      "jbdao.eth",      
   ],   
   "date": "2022-07-14T12:16:41.665Z",   
   "background_color": "FCEEB2",
   "language": "en",
   "mimeType": "image/png",
   "artifactUri": "https://gateway.pinata.cloud/ipfs/bafybeidzjspyfpr5xjaisxr32keyovrzsbvvxsksupxu7sfbim7b5ram44/0001.png",
   "displayUri": "https://gateway.pinata.cloud/ipfs/bafybeidzjspyfpr5xjaisxr32keyovrzsbvvxsksupxu7sfbim7b5ram44/0001.png",   
   "externalUri": "https://meowsdao.xyz",
   "uri": "https://gateway.pinata.cloud/ipfs/bafybeidzjspyfpr5xjaisxr32keyovrzsbvvxsksupxu7sfbim7b5ram44/0001.png",
   "animation_uri": "https://gateway.pinata.cloud/ipfs/bafybeidzjspyfpr5xjaisxr32keyovrzsbvvxsksupxu7sfbim7b5ram44/0001.png",      
   "image": "https://gateway.pinata.cloud/ipfs/bafybeidzjspyfpr5xjaisxr32keyovrzsbvvxsksupxu7sfbim7b5ram44/0001.png",         
   "rights": "© 2022 MeowsDAO, JuiceBoxDAO, Important Stuff Inc."
   "attributes": [
      {
         "trait_type": "Contribution floor",
         "value": "0.1 ETH"
      },      
      {
         "trait_type": "Contribution floor",
         "value": 0.1
      },
      {
         "trait_type": "Max supply",
         "value": 4
      },
      {
         "trait_type": "Dexterity",
         "display_type": "boost_percentage",
         "value": 45
      },      
      {
         "trait_type": "Contribution date",
         "display_type": "date",
         "value": 1565790673966 // unix timestamp in seconds
      }
   ]   
}

*/
