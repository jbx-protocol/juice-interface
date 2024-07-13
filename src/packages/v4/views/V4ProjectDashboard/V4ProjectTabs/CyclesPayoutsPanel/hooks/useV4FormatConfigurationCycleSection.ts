import { t } from '@lingui/macro';
import { pairToDatum } from 'components/Project/ProjectHeader/utils/pairToDatum';
import { ConfigurationPanelDatum } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel';
import { Ruleset } from 'packages/v4/models/ruleset';
import { V4CurrencyOption } from 'packages/v4/models/v4CurrencyOption';
import { getApprovalStrategyByAddress } from 'packages/v4/utils/approvalHooks';
import { formatCurrencyAmount } from 'packages/v4/utils/formatV4CurrencyAmount';
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math';
import { useMemo } from 'react';
import { formatTime } from 'utils/format/formatTime';
import { timeSecondsToDateString } from 'utils/timeSecondsToDateString';

export const useV4FormatConfigurationCycleSection = ({
  ruleset,
  payoutLimitAmountCurrency,
  queuedRuleset,
  upcomingPayoutLimitAmountCurrency,
}: {
  ruleset?: Ruleset | null;
  payoutLimitAmountCurrency: {
    amount: bigint | undefined;
    currency: V4CurrencyOption | undefined;
  };
  queuedRuleset?: Ruleset | null;
  upcomingPayoutLimitAmountCurrency?: {
    amount: bigint | undefined;
    currency: V4CurrencyOption | undefined;
  } | null;
}) => {
  const formatDuration = (duration: bigint | undefined) => {
    if (duration === undefined) return undefined;
    if (duration === 0n) return t`Not set`;
    return timeSecondsToDateString(Number(duration), 'short', 'lower');
  };

  const durationDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentDuration = formatDuration(ruleset?.duration);
    if (queuedRuleset === null) {
      return pairToDatum(t`Duration`, currentDuration, null);
    }
    const upcomingDuration = formatDuration(queuedRuleset?.duration);

    return pairToDatum(t`Duration`, currentDuration, upcomingDuration);
  }, [ruleset?.duration, queuedRuleset]);
  
  const queuedRulesetStart = ruleset?.start ? 
    ruleset.start + (ruleset?.duration || 0n)
  : 0n;

  const startTimeDatum: ConfigurationPanelDatum = useMemo(() => {
    const formattedTime =
    queuedRuleset === null
        ? formatTime(ruleset?.start)
        : ruleset?.duration === 0n
        ? t`Any time`
        : formatTime(queuedRulesetStart);

    const formatTimeDatum: ConfigurationPanelDatum = {
      name: t`Start time`,
      new: formattedTime,
      easyCopy: true,
    };
    return formatTimeDatum;
  }, [ruleset?.start, ruleset?.duration, queuedRuleset, queuedRulesetStart]);

  const formatPayoutAmount = (
    amount: bigint | undefined,
    currency: V4CurrencyOption | undefined,
  ) => {
    if (amount === undefined) return undefined;
    if (amount === MAX_PAYOUT_LIMIT) return t`Unlimited`;
    if (amount === 0n) return t`Zero (no payouts)`;
    return formatCurrencyAmount({
      amount: Number(amount) / 1e18, // Assuming fromWad
      currency,
    });
  };

  const payoutsDatum: ConfigurationPanelDatum = useMemo(() => {
    const { amount, currency } = payoutLimitAmountCurrency ?? {};
    const currentPayout = formatPayoutAmount(amount, currency);

    if (upcomingPayoutLimitAmountCurrency === null) {
      return pairToDatum(t`Payouts`, currentPayout, null);
    }

    const upcomingPayoutLimit =
      upcomingPayoutLimitAmountCurrency?.amount !== undefined
        ? upcomingPayoutLimitAmountCurrency.amount
        : undefined;
    const upcomingPayoutLimitCurrency =
      upcomingPayoutLimitAmountCurrency?.currency !== undefined
        ? upcomingPayoutLimitAmountCurrency.currency
        : undefined;
    const upcomingPayout = formatPayoutAmount(
      upcomingPayoutLimit,
      upcomingPayoutLimitCurrency,
    );

    return pairToDatum(t`Payouts`, currentPayout, upcomingPayout);
  }, [payoutLimitAmountCurrency, upcomingPayoutLimitAmountCurrency]);

  const editDeadlineDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentApprovalStrategy = ruleset?.approvalHook
      ? getApprovalStrategyByAddress(ruleset.approvalHook)
      : undefined;
    const current = currentApprovalStrategy?.name;
    if (queuedRuleset === null) {
      return pairToDatum(t`Edit deadline`, current, null);
    }

    const upcomingBallotStrategy = queuedRuleset?.approvalHook
      ? getApprovalStrategyByAddress(queuedRuleset.approvalHook)
      : undefined;
    const upcoming = upcomingBallotStrategy?.name;
    return pairToDatum(t`Edit deadline`, current, upcoming);
  }, [ruleset?.approvalHook, queuedRuleset]);

  return useMemo(() => {
    return {
      duration: durationDatum,
      startTime: startTimeDatum,
      payouts: payoutsDatum,
      editDeadline: editDeadlineDatum,
    };
  }, [durationDatum, startTimeDatum, editDeadlineDatum, payoutsDatum]);
};
