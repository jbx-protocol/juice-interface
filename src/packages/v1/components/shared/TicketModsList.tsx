import { t, Trans } from '@lingui/macro'
import { Button, Modal, Space } from 'antd'
import { CsvUpload } from 'components/inputs/CsvUpload'
import Mod from 'packages/v1/components/shared/Mod'
import ProjectTicketMods from 'packages/v1/components/shared/ProjectTicketMods'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { useV1ConnectedWalletHasPermission } from 'packages/v1/hooks/contractReader/useV1ConnectedWalletHasPermission'
import { useSetTicketModsTx } from 'packages/v1/hooks/transactor/useSetTicketModsTx'
import { V1FundingCycle } from 'packages/v1/models/fundingCycle'
import { TicketMod } from 'packages/v1/models/mods'
import { V1OperatorPermission } from 'packages/v1/models/permissions'
import { MODS_TOTAL_PERCENT } from 'packages/v1/utils/mods'
import {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { parseV1TicketModsCsv } from 'utils/csv'
import { formatWad, permyriadToPercent } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
export default function TicketModsList({
  total,
  mods,
  fundingCycle,
  projectId,
  reservedRate,
}: {
  total?: bigint
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
  const ownerPercent = Number(MODS_TOTAL_PERCENT) - (modsTotal ?? 0)

  const hasEditPermission = useV1ConnectedWalletHasPermission(
    V1OperatorPermission.SetTicketMods,
  )

  const onModsChanged = useCallback(
    (newMods: TicketMod[]) => {
      setEditingMods(newMods)
    },
    [setEditingMods],
  )

  return (
    <div>
      {mods?.length
        ? [...mods]
            .sort((a, b) => (a.percent < b.percent ? 1 : -1))
            .map(mod => (
              <div className="mb-1" key={mod.beneficiary ?? '' + mod.percent}>
                <Mod
                  mod={mod}
                  value={
                    permyriadToPercent(mod.percent) +
                    '%' +
                    (total
                      ? ` (${formatWad(
                          total
                            ? (Number(total) * mod.percent) / 10000
                            : undefined,
                          {
                            precision: 0,
                          },
                        )} ${tokenSymbolText({
                          tokenSymbol,
                          capitalize: false,
                          plural: true,
                        })})`
                      : '')
                  }
                />
              </div>
            ))
        : null}

      {ownerPercent > 0 && reservedRate > 0 && (
        <Mod
          mod={{ beneficiary: owner, percent: ownerPercent }}
          value={
            <span className="font-normal">
              {permyriadToPercent(ownerPercent)}%
              {total
                ? ` (${formatWad(
                    total ? (Number(total) * ownerPercent) / 10000 : undefined,
                    {
                      precision: 0,
                    },
                  )} ${tokenSymbolText({
                    tokenSymbol,
                    capitalize: false,
                    plural: true,
                  })})`
                : ''}
            </span>
          }
        />
      )}

      {fundingCycle && projectId && hasEditPermission ? (
        <div className="mt-2">
          <Button size="small" onClick={() => setModalVisible(true)}>
            <Trans>Edit recipients</Trans>
          </Button>
        </div>
      ) : null}

      {fundingCycle ? (
        <Modal
          open={modalVisible}
          title={t`Edit reserved token recipients`}
          okText={t`Save recipients`}
          onOk={() => setMods()}
          onCancel={() => {
            setEditingMods(mods)
            setModalVisible(false)
          }}
          confirmLoading={loading}
          width={720}
        >
          <Space className="min-h-0 w-full" direction="vertical" size="middle">
            <div className="flex justify-between">
              <Trans>Reserved token allocation</Trans>

              <CsvUpload
                onChange={onModsChanged}
                templateUrl={'/assets/csv/v1-reserve-template.csv'}
                parser={parseV1TicketModsCsv}
              />
            </div>
            <ProjectTicketMods
              mods={editingMods}
              lockedMods={lockedMods}
              onModsChanged={setEditingMods}
              reservedRate={reservedRate}
            />
          </Space>
        </Modal>
      ) : null}
    </div>
  )
}
