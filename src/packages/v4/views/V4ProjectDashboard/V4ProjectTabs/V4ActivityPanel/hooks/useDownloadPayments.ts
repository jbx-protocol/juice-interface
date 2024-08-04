import { t } from "@lingui/macro";
import { OrderDirection, PayEvent_OrderBy, PayEventsDocument } from "packages/v4/graphql/client/graphql";
import { useSubgraphQuery } from "packages/v4/graphql/useSubgraphQuery";
import { useCallback, useState } from 'react';
import { downloadCsvFile } from "utils/csv";
import { emitErrorNotification } from 'utils/notifications';
import { transformPayEventsRes } from "../utils/transformEventsData";


export const useDownloadPayments = (blockNumber: number, projectId: number) => {
  const [isLoading, setIsLoading] = useState(false);

  const { data: payEventsData } = useSubgraphQuery(PayEventsDocument, {
    orderBy: PayEvent_OrderBy.timestamp,
    orderDirection: OrderDirection.desc,
    where: {
      projectId: Number(projectId),
    },
  });
  
  const downloadPayments = useCallback(async () => {
    if (blockNumber === undefined || !projectId) return;

    setIsLoading(true);

    const rows = [
      [
        t`Date`,
        t`ETH paid`,
        // t`USD value of ETH paid`, //TODO: not working for V4 (check subgraph
        t`Payer`,
        t`Transaction hash`,
      ], // CSV header row
    ];

    try {
      const payEvents = transformPayEventsRes(payEventsData);

      if (!payEvents) {
        emitErrorNotification(t`Error loading payouts`);
        throw new Error('No data.');
      }

      // Interpolate distributions into payouts.
      let x = 0;
      payEvents.forEach(p => {
        let date = new Date((p.timestamp ?? 0) * 1000).toUTCString()
  
        if (date.includes(', ')) date = date.split(', ')[1]
  
        rows.push([
          date,
          p.amount.format(),
          // p.amountUSD ? p.amountUSD.format() : 'n/a', TODO: not working for V4 (check subgraph)
          p.beneficiary,
          p.txHash,
        ])
      })
  
      downloadCsvFile(`payments_v4_p${projectId}_block-${blockNumber}`, rows)
    } catch (e) {
      console.error('Error downloading payouts', e);
      emitErrorNotification(t`Error downloading payouts, try again.`);
    } finally {
      setIsLoading(false);
    }
  }, [blockNumber, projectId, payEventsData]);

  return { downloadPayments, isLoading };
};
