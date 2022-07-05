import { NetworkName } from 'models/network-name'

export const JB_V1_TOKEN_PAYMENT_TERMINAL_ADDRESS: {
  [k in NetworkName]?: string
} = {
  mainnet: '0x88465c0a24a2e3ac55b7176beb07b3d56ec5cde1',
  rinkeby: '0x349384f3ccc2045443b94b20d0af71edaf7fea36',
}
