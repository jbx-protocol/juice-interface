import {
  JB721_DELEGATE_V3_2,
  JB721_DELEGATE_V3_3,
} from 'constants/delegateVersions'
import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/networkName'
import { JB721DelegateVersion } from 'models/nftRewards'

export const DEFAULT_JB_721_DELEGATE_VERSION: JB721DelegateVersion =
  readNetwork.name === NetworkName.goerli
    ? JB721_DELEGATE_V3_3
    : JB721_DELEGATE_V3_2
