import { PayoutMod } from 'models/mods'

export type EditingPayoutMod = PayoutMod & { handle?: string; percent?: number }
