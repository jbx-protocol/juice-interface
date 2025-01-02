import { useEffect, useState } from "react";
import { useJBChainId, useSuckers } from "juice-sdk-react";

import { JuiceListbox } from "components/inputs/JuiceListbox";
import { NETWORKS } from "constants/networks";
import { PayProjectModalFormValues } from "../hooks/usePayProjectModal/usePayProjectModal";
import { Sucker } from "packages/v4/models/suckers";
import { Trans } from "@lingui/macro";
import axios from "axios";
import { useFormikContext } from "formik";
import { useProjectPaymentTokens } from "../hooks/useProjectPaymentTokens";

type GasEstimates = Record<number, string>;

export const ChainSelectSection = () => {
  const [gasEstimates, setGasEstimates] = useState<GasEstimates>({});

  const { receivedTokenSymbolText } = useProjectPaymentTokens();

  const { data: suckers } = useSuckers() as { data: Sucker[] | undefined }

  const defaultChainId = useJBChainId();
  const { values, setFieldValue } =
    useFormikContext<PayProjectModalFormValues>();

  const allowedChainIds = new Set(suckers?.map((sucker) => sucker.peerChainId));
  const networkOptions = Object.entries(NETWORKS)
    .filter(([chainId]) => allowedChainIds.has(parseInt(chainId)))
    .map(([chainId, networkInfo]) => ({
      label: networkInfo.label,
      value: parseInt(chainId),
    }));

  const fetchGasEstimates = async () => {
    const estimates: GasEstimates = {};
    for (const option of networkOptions) {
      try {
        const response = await axios.get(
          `https://api.blocknative.com/gasprices/blockprices?chainid=${option.value}`
        );
        const data = response.data
        const estimatedGas =
          data?.blockPrices[0]?.estimatedPrices[0]?.maxFeePerGas;
        estimates[option.value] = estimatedGas || "Unavailable";
      } catch (error) {
        estimates[option.value] = "Error fetching";
      }
    }
    setGasEstimates(estimates);
  }

  useEffect(() => {
    fetchGasEstimates();
  }, []);

  if (!suckers || suckers.length <= 1) return null;

  return (
    <div className="py-6 flex flex-col gap-3">
      <span className="font-medium">
        <Trans>Chain selection</Trans>
      </span>

      <span className="text-grey-500 dark:text-slate-200">
        <strong>{receivedTokenSymbolText}</strong> is available on multiple chains.
      </span>

      <JuiceListbox
        value={{
          label: defaultChainId
            ? NETWORKS[values.chainId ?? defaultChainId]?.label
            : "",
          value: values.chainId,
        }}
        onChange={({ value }) => {
          if (!value) return;
          setFieldValue?.("chainId", value);
        }}
        options={networkOptions.map((option) => ({
          ...option,
          label: `${option.label} - Gas: ${
            gasEstimates[option.value] || "Loading..."
          }`,
        }))}
      />
    </div>
  );
};
