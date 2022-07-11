import { t, Trans } from '@lingui/macro'
import { Button, Modal } from 'antd'
import ProjectTicketMods from 'components/v1/shared/ProjectTicketMods'
import Mod from 'components/v1/shared/Mod'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useUserHasPermission } from 'hooks/v1/contractReader/UserHasPermission'
import { useSetTicketModsTx } from 'hooks/v1/transactor/SetTicketModsTx'
import { V1FundingCycle } from 'models/v1/fundingCycle'
import { TicketMod } from 'models/mods'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { formatWad, permyriadToPercent } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { OperatorPermission } from 'hooks/v1/contractReader/HasPermission'

export default function TicketModsList({
  total,
  mods,
  fundingCycle,
  projectId,
  reservedRate,
}: {
  total?: BigNumber
  mods: TicketMod[] | undefined
  fundingCycle: V1FundingCycle | undefined
  projectId: number | undefined
  reservedRate: number
}) {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [editingMods, setEditingMods] = useState<TicketMod[]>()
  const { owner, tokenSymbol } = useContext(V1ProjectContext)
  const setTicketModsTx = useSetTicketModsTx()

  const { editableMods, lockedMods } = useMemo(() => {
    const now = new Date().valueOf() / 1000

    return {
      editableMods:
        mods?.filter(m => !m.lockedUntil || m.lockedUntil < now) ?? [],
      lockedMods: mods?.filter(m => m.lockedUntil && m.lockedUntil > now) ?? [],
    }
  }, [mods])

  useLayoutEffect(() => setEditingMods(editableMods), [editableMods])

  function setMods() {
    if (!fundingCycle || !editingMods) return

    setLoading(true)

    setTicketModsTx(
      {
        configured: fundingCycle.configured,
        ticketMods: [...lockedMods, ...editingMods],
      },
      {
        onDone: () => setLoading(false),
        onConfirmed: () => {
          setModalVisible(false)
          setEditingMods(editableMods)
        },
      },
    )
  }

  const modsTotal = mods?.reduce((acc, curr) => acc + curr.percent, 0)
  const ownerPercent = 10000 - (modsTotal ?? 0)

  const hasEditPermission = useUserHasPermission(
    OperatorPermission.SetTicketMods,
  )

  return (
    <div>
      {mods?.length
        ? [...mods]
            .sort((a, b) => (a.percent < b.percent ? 1 : -1))
            .map(mod => (
              <div
                key={mod.beneficiary ?? '' + mod.percent}
                style={{ marginBottom: 5 }}
              >
                <Mod
                  mod={mod}
                  value={
                    permyriadToPercent(mod.percent) +
                    '%' +
                    (total
                      ? ` (${formatWad(total?.mul(mod.percent).div(10000), {
                          precision: 0,
                        })} ${tokenSymbolText({
                          tokenSymbol: tokenSymbol,
                          capitalize: false,
                          plural: true,
                        })})`
                      : '')
                  }
                />
              </div>
            ))
        : null}

      {ownerPercent > 0 && (
        <Mod
          mod={{ beneficiary: owner, percent: ownerPercent }}
          value={
            <span style={{ fontWeight: 400 }}>
              {permyriadToPercent(ownerPercent)}%
              {total
                ? ` (${formatWad(total?.mul(ownerPercent).div(10000), {
                    precision: 0,
                  })} ${tokenSymbolText({
                    tokenSymbol: tokenSymbol,
                    capitalize: false,
                    plural: true,
                  })})`
                : ''}
            </span>
          }
        />
      )}

      {fundingCycle && projectId && hasEditPermission ? (
        <div style={{ marginTop: 10 }}>
          <Button size="small" onClick={() => setModalVisible(true)}>
            <Trans>Edit token allocation</Trans>
          </Button>
        </div>
      ) : null}

      {fundingCycle ? (
        <Modal
          visible={modalVisible}
          title={t`Edit reserved token allocation`}
          okText={t`Save token allocation`}
          onOk={() => setMods()}
          onCancel={() => {
            setEditingMods(mods)
            setModalVisible(false)
          }}
          confirmLoading={loading}
          width={720}
        >
          <ProjectTicketMods
            mods={editingMods}
            lockedMods={lockedMods}
            onModsChanged={setEditingMods}
            reservedRate={reservedRate}
          />
        </Modal>
      ) : null}
    </div>
  )
}
