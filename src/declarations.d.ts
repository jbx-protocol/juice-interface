import { ExternalProvider } from '@ethersproject/providers'
declare const Desmos
declare module 'ethereum-block-by-date'

declare global {
  interface Window {
    ethereum?: ExternalProvider
  }
}
