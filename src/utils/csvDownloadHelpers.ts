import { t } from '@lingui/macro'
import { PV } from 'models/pv'
import { downloadCsvFile } from 'utils/csv'
import { fromWad } from 'utils/format/formatNumber'
import { querySubgraphExhaustive } from 'utils/graph'
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
    const participants = await querySubgraphExhaustive({
      entity: 'participant',
      keys: [
        'lastPaidTimestamp',
        'wallet',
        'totalPaid',
        'totalPaidUSD',
        'balance',
        'stakedBalance',
        'erc20Balance',
      ],
      orderBy: 'balance',
      orderDirection: 'desc',
      block: {
        number: blockNumber,
      },
      where: [
        {
          key: 'projectId',
          value: projectId,
        },
        {
          key: 'pv',
          value: pv,
        },
      ],
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
        p.wallet,
        fromWad(p.totalPaid),
        fromWad(p.totalPaidUSD),
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
    const payouts = await querySubgraphExhaustive({
      entity: 'distributeToPayoutSplitEvent',
      keys: [
        'timestamp',
        'amount',
        'amountUSD',
        'splitProjectId',
        'beneficiary',
        'txHash',
      ],
      orderBy: 'timestamp',
      orderDirection: 'desc',
      block: {
        number: blockNumber,
      },
      where: [
        {
          key: 'projectId',
          value: projectId,
        },
      ],
    })

    const distributions = await querySubgraphExhaustive({
      entity: 'distributePayoutsEvent',
      keys: [
        'timestamp',
        'beneficiaryDistributionAmount',
        'beneficiaryDistributionAmountUSD',
        'beneficiary',
        'txHash',
      ],
      orderBy: 'timestamp',
      orderDirection: 'desc',
      block: {
        number: blockNumber,
      },
      where: [
        {
          key: 'projectId',
          value: projectId,
        },
      ],
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
        fromWad(p.amountUSD),
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
    const payouts = await querySubgraphExhaustive({
      entity: 'distributeToPayoutModEvent',
      keys: [
        'timestamp',
        'modCut',
        'modCutUSD',
        'modProjectId',
        'modBeneficiary',
        'txHash',
      ],
      orderBy: 'timestamp',
      orderDirection: 'desc',
      block: {
        number: blockNumber,
      },
      where: [
        {
          key: 'projectId',
          value: projectId,
        },
      ],
    })

    const taps = await querySubgraphExhaustive({
      entity: 'tapEvent',
      keys: [
        'timestamp',
        'beneficiaryTransferAmount',
        'beneficiaryTransferAmountUSD',
        'beneficiary',
        'txHash',
      ],
      orderBy: 'timestamp',
      orderDirection: 'desc',
      block: {
        number: blockNumber,
      },
      where: [
        {
          key: 'projectId',
          value: projectId,
        },
      ],
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
        fromWad(p.modCutUSD),
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
    const payments = await querySubgraphExhaustive({
      entity: 'payEvent',
      keys: [
        'timestamp',
        'amount',
        'amountUSD',
        'from',
        'beneficiary',
        'txHash',
      ],
      orderBy: 'timestamp',
      orderDirection: 'desc',
      block: {
        number: blockNumber,
      },
      where: [
        {
          key: 'projectId',
          value: projectId,
        },
        {
          key: 'pv',
          value: pv,
        },
      ],
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
        fromWad(p.amountUSD),
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
      t`from`,
      t`Beneficiary`,
      t`Transaction hash`,
    ], // CSV header row
  ]

  try {
    const redemptions = await querySubgraphExhaustive({
      entity: 'redeemEvent',
      keys: [
        'timestamp',
        'amount',
        'returnAmount',
        'returnAmountUSD',
        'from',
        'beneficiary',
        'txHash',
      ],
      orderBy: 'timestamp',
      orderDirection: 'desc',
      block: {
        number: blockNumber,
      },
      where: [
        {
          key: 'projectId',
          value: projectId,
        },
        {
          key: 'pv',
          value: pv,
        },
      ],
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
        fromWad(r.returnAmountUSD),
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
      t`from`,
      t`Transaction hash`,
    ], // CSV header row
  ]

  try {
    const additions = await querySubgraphExhaustive({
      entity: 'addToBalanceEvent',
      keys: ['timestamp', 'amount', 'amountUSD', 'from', 'txHash'],
      orderBy: 'timestamp',
      orderDirection: 'desc',
      block: {
        number: blockNumber,
      },
      where: [
        {
          key: 'projectId',
          value: projectId,
        },
        {
          key: 'pv',
          value: pv,
        },
      ],
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
        fromWad(a.amountUSD),
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
