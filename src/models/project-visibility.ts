export type ProjectState = 'active' | 'archived'
export type ProjectStateFilter = { [key in ProjectState]: boolean }
export type ProjectCategory = 'all' | 'holdings' | 'trending' //| 'metaverse' | 'defi' | 'nft' | 'web3'
