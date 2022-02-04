export type ProjectState = 'active' | 'archived'
export type ProjectStateFilter = { [key in ProjectState]: boolean }
export type ProjectCategory = 'all' | 'myprojects' | 'trending' //| 'metaverse' | 'defi' | 'nft' | 'web3'
