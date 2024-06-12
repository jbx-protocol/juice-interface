import { PayoutMod } from 'packages/v1/models/mods'

export type EditingPayoutMod = PayoutMod & { handle?: string; percent?: number }
