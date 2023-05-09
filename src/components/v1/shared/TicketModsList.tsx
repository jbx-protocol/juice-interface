import { t, Trans } from '@lingui/macro'
import { Button, Modal, Space } from 'antd'
import { CsvUpload } from 'components/inputs/CsvUpload'
import Mod from 'components/v1/shared/Mod'
import ProjectTicketMods from 'components/v1/shared/ProjectTicketMods'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { BigNumber } from 'ethers'
import { useV1ConnectedWalletHasPermission } from 'hooks/v1/contractReader/useV1ConnectedWalletHasPermission'
import { useSetTicketModsTx } from 'hooks/v1/transactor/useSetTicketModsTx'
import { V1FundingCycle } from 'models/v1/fundingCycle'
import { TicketMod } from 'models/v1/mods'
import { V1OperatorPermission } from 'models/v1/permissions'
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
import { MODS_TOTAL_PERCENT } from 'utils/v1/mods'
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
  const ownerPercent = MODS_TOTAL_PERCENT - (modsTotal ?? 0)

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
                      ? ` (${formatWad(total?.mul(mod.percent).div(10000), {
                          precision: 0,
                        })} ${tokenSymbolText({
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
                ? ` (${formatWad(total?.mul(ownerPercent).div(10000), {
                    precision: 0,
                  })} ${tokenSymbolText({
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
