import { PayoutMod } from 'models/v1/mods'

export type EditingPayoutMod = PayoutMod & { handle?: string; percent?: number }
