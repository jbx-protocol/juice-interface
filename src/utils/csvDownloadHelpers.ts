import { t } from '@lingui/macro'
import {
  AddToBalanceEventsDownloadDocument,
  AddToBalanceEventsDownloadQuery,
  DistributePayoutsEventsDownloadDocument,
  DistributePayoutsEventsDownloadQuery,
  DistributeToPayoutModEventsDownloadDocument,
  DistributeToPayoutModEventsDownloadQuery,
  DistributeToPayoutSplitEventsDownloadDocument,
  DistributeToPayoutSplitEventsDownloadQuery,
  ParticipantsDownloadDocument,
  ParticipantsDownloadQuery,
  PayEventsDownloadDocument,
  PayEventsDownloadQuery,
  QueryAddToBalanceEventsArgs,
  QueryDistributePayoutsEventsArgs,
  QueryDistributeToPayoutModEventsArgs,
  QueryDistributeToPayoutSplitEventsArgs,
  QueryParticipantsArgs,
  QueryPayEventsArgs,
  QueryRedeemEventsArgs,
  QueryTapEventsArgs,
  RedeemEventsDownloadDocument,
  RedeemEventsDownloadQuery,
  TapEventsDownloadDocument,
  TapEventsDownloadQuery,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { paginateDepleteQuery } from 'lib/apollo/paginateDepleteQuery'
import { PV } from 'models/pv'
import { downloadCsvFile } from 'utils/csv'
import { fromWad } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'

export async function downloadParticipants(
  blockNumber: number | undefined,
  projectId: number | undefined,
  pv: PV | undefined,
) {
  if (blockNumber === undefined || !projectId || !pv) return

  const rows = [
    [
      t`Last paid`,
      t`Wallet`,
      t`Total ETH paid`,
      t`USD value of ETH paid`,
      t`Balance`,
      t`Staked balance`,
      t`Unstaked balance`,
    ], // CSV header row
  ]

  try {
    const participants = await paginateDepleteQuery<
      ParticipantsDownloadQuery,
      QueryParticipantsArgs
    >({
      client,
      document: ParticipantsDownloadDocument,
      variables: {
        where: {
          projectId,
          pv,
        },
        block: {
          number: blockNumber,
        },
      },
    })

    if (!participants) {
      emitErrorNotification(t`Error loading participants`)
      throw new Error('No data.')
    }

    participants.forEach(p => {
      let date = new Date((p.lastPaidTimestamp ?? 0) * 1000).toUTCString()

      if (date.includes(', ')) date = date.split(', ')[1]

      rows.push([
        date,
        p.wallet.id,
        fromWad(p.volume),
        fromWad(p.volumeUSD),
        fromWad(p.balance),
        fromWad(p.stakedBalance),
        fromWad(p.erc20Balance),
      ])
    })

    downloadCsvFile(
      `participants_v${pv}p${projectId}_block-${blockNumber}`,
      rows,
    )
  } catch (e) {
    console.error('Error downloading participants', e)
    emitErrorNotification(t`Error downloading participants, try again.`)
  }
}

export async function downloadV2V3Payouts(
  blockNumber: number | undefined,
  projectId: number | undefined,
) {
  if (blockNumber === undefined || !projectId) return

  const rows = [
    [
      t`Date`,
      t`ETH paid`,
      t`USD value of ETH paid`,
      t`Recipient`,
      t`Transaction hash`,
    ], // CSV header row
  ]

  try {
    const payouts = await paginateDepleteQuery<
      DistributeToPayoutSplitEventsDownloadQuery,
      QueryDistributeToPayoutSplitEventsArgs
    >({
      client,
      document: DistributeToPayoutSplitEventsDownloadDocument,
      variables: {
        where: { projectId },
        block: {
          number: blockNumber,
        },
      },
    })

    const distributions = await paginateDepleteQuery<
      DistributePayoutsEventsDownloadQuery,
      QueryDistributePayoutsEventsArgs
    >({
      client,
      document: DistributePayoutsEventsDownloadDocument,
      variables: {
        where: { projectId },
        block: {
          number: blockNumber,
        },
      },
    })

    if (!payouts && !distributions) {
      emitErrorNotification(t`Error loading payouts`)
      throw new Error('No data.')
    }

    // Interpolate distributions into payouts.
    let x = 0
    distributions.forEach(d => {
      if (payouts) {
        while (d.timestamp < payouts[x].timestamp) {
          x += 1
        }
      } else {
        x += 1
      }

      // TODO Any better ways to do this?
      payouts.splice(x, 0, {
        timestamp: d.timestamp,
        amount: d.beneficiaryDistributionAmount,
        amountUSD: d.beneficiaryDistributionAmountUSD,
        splitProjectId: 0,
        beneficiary: d.beneficiary,
        txHash: d.txHash,
      })
    })

    payouts.forEach(p => {
      let date = new Date((p.timestamp ?? 0) * 1000).toUTCString()
      if (date.includes(', ')) date = date.split(', ')[1]

      let beneficiary = p.beneficiary
      if (p.splitProjectId) beneficiary = `Project ${p.splitProjectId}`

      rows.push([
        date,
        fromWad(p.amount),
        p.amountUSD ? fromWad(p.amountUSD) : 'n/a',
        beneficiary,
        p.txHash,
      ])
    })

    downloadCsvFile(`payouts_v2p${projectId}_block-${blockNumber}`, rows)
  } catch (e) {
    console.error('Error downloading payouts', e)
    emitErrorNotification(t`Error downloading payouts, try again.`)
  }
}

export async function downloadV1Payouts(
  blockNumber: number | undefined,
  projectId: number | undefined,
) {
  if (blockNumber === undefined || !projectId) return

  const rows = [
    [
      t`Date`,
      t`ETH paid`,
      t`USD value of ETH paid`,
      t`Recipient`,
      t`Transaction hash`,
    ], // CSV header row
  ]

  try {
    const payouts = await paginateDepleteQuery<
      DistributeToPayoutModEventsDownloadQuery,
      QueryDistributeToPayoutModEventsArgs
    >({
      client,
      document: DistributeToPayoutModEventsDownloadDocument,
      variables: {
        where: {
          projectId,
        },
        block: {
          number: blockNumber,
        },
      },
    })

    const taps = await paginateDepleteQuery<
      TapEventsDownloadQuery,
      QueryTapEventsArgs
    >({
      client,
      document: TapEventsDownloadDocument,
      variables: {
        where: {
          projectId,
        },
        block: {
          number: blockNumber,
        },
      },
    })

    if (!payouts && !taps) {
      emitErrorNotification(t`Error loading payouts`)
      throw new Error('No data.')
    }

    // Interpolate distributions into payouts.
    let x = 0
    taps.forEach(t => {
      if (payouts) {
        while (t.timestamp < payouts[x].timestamp) {
          x += 1
        }
      } else {
        x += 1
      }

      // Any better ways to do this?
      payouts.splice(x, 0, {
        timestamp: t.timestamp,
        modCut: t.beneficiaryTransferAmount,
        modCutUSD: t.beneficiaryTransferAmountUSD,
        modProjectId: 0,
        modBeneficiary: t.beneficiary,
        txHash: t.txHash,
      })
    })

    payouts.forEach(p => {
      let date = new Date((p.timestamp ?? 0) * 1000).toUTCString()
      if (date.includes(', ')) date = date.split(', ')[1]

      let beneficiary = p.modBeneficiary
      if (p.modProjectId) beneficiary = `v1 project ${p.modProjectId}`

      rows.push([
        date,
        fromWad(p.modCut),
        p.modCutUSD ? fromWad(p.modCutUSD) : 'n/a',
        beneficiary,
        p.txHash,
      ])
    })

    downloadCsvFile(`payouts_v1p${projectId}_block${blockNumber}`, rows)
  } catch (e) {
    console.error('Error downloading payouts', e)
    emitErrorNotification(t`Error downloading payouts, try again.`)
  }
}

export async function downloadPayments(
  blockNumber: number | undefined,
  projectId: number | undefined,
  pv: PV | undefined,
) {
  if (blockNumber === undefined || !projectId || !pv) return

  const rows = [
    [
      t`Date`,
      t`ETH paid`,
      t`USD value of ETH paid`,
      t`Payer`,
      t`Beneficiary`,
      t`Transaction hash`,
    ], // CSV header row
  ]

  try {
    const payments = await paginateDepleteQuery<
      PayEventsDownloadQuery,
      QueryPayEventsArgs
    >({
      client,
      document: PayEventsDownloadDocument,
      variables: {
        block: {
          number: blockNumber,
        },
        where: {
          projectId,
          pv,
        },
      },
    })

    if (!payments) {
      emitErrorNotification(t`Error loading payments`)
      throw new Error('No data.')
    }

    payments.forEach(p => {
      let date = new Date((p.timestamp ?? 0) * 1000).toUTCString()

      if (date.includes(', ')) date = date.split(', ')[1]

      rows.push([
        date,
        fromWad(p.amount),
        p.amountUSD ? fromWad(p.amountUSD) : 'n/a',
        p.from,
        p.beneficiary,
        p.txHash,
      ])
    })

    downloadCsvFile(`payments_v${pv}p${projectId}_block-${blockNumber}`, rows)
  } catch (e) {
    console.error('Error downloading payments', e)
    emitErrorNotification(t`Error downloading payments, try again.`)
  }
}

export async function downloadRedemptions(
  blockNumber: number | undefined,
  projectId: number | undefined,
  pv: PV | undefined,
) {
  if (blockNumber === undefined || !projectId || !pv) return

  const rows = [
    [
      t`Date`,
      t`Tokens redeemed`,
      t`ETH received`,
      t`USD value of ETH received`,
      t`From`,
      t`Beneficiary`,
      t`Transaction hash`,
    ], // CSV header row
  ]

  try {
    const redemptions = await paginateDepleteQuery<
      RedeemEventsDownloadQuery,
      QueryRedeemEventsArgs
    >({
      client,
      document: RedeemEventsDownloadDocument,
      variables: {
        block: {
          number: blockNumber,
        },
        where: {
          projectId,
          pv,
        },
      },
    })

    if (!redemptions) {
      emitErrorNotification(t`Error loading redemptions`)
      throw new Error('No data.')
    }

    redemptions.forEach(r => {
      let date = new Date((r.timestamp ?? 0) * 1000).toUTCString()

      if (date.includes(', ')) date = date.split(', ')[1]

      rows.push([
        date,
        fromWad(r.amount),
        fromWad(r.returnAmount),
        r.returnAmountUSD ? fromWad(r.returnAmountUSD) : 'n/a',
        r.from,
        r.beneficiary,
        r.txHash,
      ])
    })

    downloadCsvFile(
      `redemptions_v${pv}p${projectId}_block-${blockNumber}`,
      rows,
    )
  } catch (e) {
    console.error('Error downloading redemptions', e)
    emitErrorNotification(t`Error downloading redemptions, try again.`)
  }
}

export async function downloadAdditionsToBalance(
  blockNumber: number | undefined,
  projectId: number | undefined,
  pv: PV | undefined,
) {
  if (blockNumber === undefined || !projectId || !pv) return

  const rows = [
    [
      t`Date`,
      t`ETH transferred`,
      t`USD value of ETH transferred`,
      t`From`,
      t`Transaction hash`,
    ], // CSV header row
  ]

  try {
    const additions = await paginateDepleteQuery<
      AddToBalanceEventsDownloadQuery,
      QueryAddToBalanceEventsArgs
    >({
      client,
      document: AddToBalanceEventsDownloadDocument,
      variables: {
        block: {
          number: blockNumber,
        },
        where: {
          projectId,
          pv,
        },
      },
    })

    if (!additions) {
      emitErrorNotification(t`Error loading ETH transfers to project`)
      throw new Error('No data.')
    }

    additions.forEach(a => {
      let date = new Date((a.timestamp ?? 0) * 1000).toUTCString()

      if (date.includes(', ')) date = date.split(', ')[1]

      rows.push([
        date,
        fromWad(a.amount),
        a.amountUSD ? fromWad(a.amountUSD) : 'n/a',
        a.from,
        a.txHash,
      ])
    })

    downloadCsvFile(`transfers_v${pv}p${projectId}_block-${blockNumber}`, rows)
  } catch (e) {
    console.error('Error downloading ETH transfers to project', e)
    emitErrorNotification(
      t`Error downloading ETH transfers to project, try again.`,
    )
  }
}
