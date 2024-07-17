import { t } from '@lingui/macro';
import { ConfigurationPanelDatum } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel';
import { pairToDatum } from 'components/Project/ProjectTabs/utils/pairToDatum';
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
  upcomingRuleset,
  upcomingRulesetLoading,
  queuedPayoutLimitLoading,
  queuedPayoutLimitAmountCurrency,
}: {
  ruleset?: Ruleset | null;
  payoutLimitAmountCurrency: {
    amount: bigint | undefined;
    currency: V4CurrencyOption | undefined;
  };
  upcomingRuleset?: Ruleset | null;
  upcomingRulesetLoading: boolean,
  queuedPayoutLimitLoading: boolean,
  queuedPayoutLimitAmountCurrency?: {
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
    if (upcomingRuleset === null || upcomingRulesetLoading) {
      return pairToDatum(t`Duration`, currentDuration, null);
    }
    const upcomingDuration = formatDuration(
      upcomingRuleset ? upcomingRuleset?.duration : ruleset?.duration
    );

    return pairToDatum(t`Duration`, currentDuration, upcomingDuration);
  }, [ruleset?.duration, upcomingRuleset, upcomingRulesetLoading]);
  
  const upcomingRulesetStart = ruleset?.start ? 
    ruleset.start + (ruleset?.duration || 0n)
  : 0n;

  const startTimeDatum: ConfigurationPanelDatum = useMemo(() => {
    const formattedTime =
    upcomingRuleset === null
        ? formatTime(ruleset?.start)
        : ruleset?.duration === 0n
        ? t`Any time`
        : formatTime(upcomingRulesetStart);

    const formatTimeDatum: ConfigurationPanelDatum = {
      name: t`Start time`,
      new: formattedTime,
      easyCopy: true,
    };
    return formatTimeDatum;
  }, [ruleset?.start, ruleset?.duration, upcomingRuleset, upcomingRulesetStart]);

  const formatPayoutAmount = (
    amount: bigint | undefined,
    currency: V4CurrencyOption | undefined,
  ) => {
    if (amount === undefined || amount === MAX_PAYOUT_LIMIT) return t`Unlimited`;
    if (amount === 0n) return t`Zero (no payouts)`;
    return formatCurrencyAmount({
      amount: Number(amount) / 1e18, // Assuming fromWad
      currency,
    });
  };

  const payoutsDatum: ConfigurationPanelDatum = useMemo(() => {
    const { amount, currency } = payoutLimitAmountCurrency ?? {};
    const currentPayout = formatPayoutAmount(amount, currency);

    if (queuedPayoutLimitAmountCurrency === null || queuedPayoutLimitLoading) {
      return pairToDatum(t`Payouts`, currentPayout, null);
    }

    const queuedPayoutLimit =
      queuedPayoutLimitAmountCurrency?.amount !== undefined
        ? queuedPayoutLimitAmountCurrency.amount
        : amount
    const queuedPayoutLimitCurrency =
      queuedPayoutLimitAmountCurrency?.currency !== undefined
        ? queuedPayoutLimitAmountCurrency.currency
        : currency;
    const queuedPayout = formatPayoutAmount(
      queuedPayoutLimit,
      queuedPayoutLimitCurrency,
    );

    return pairToDatum(t`Payouts`, currentPayout, queuedPayout);
  }, [payoutLimitAmountCurrency, queuedPayoutLimitAmountCurrency, queuedPayoutLimitLoading]);

  const editDeadlineDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentApprovalStrategy = ruleset?.approvalHook
      ? getApprovalStrategyByAddress(ruleset.approvalHook)
      : undefined;
    const current = currentApprovalStrategy?.name;
    if (upcomingRuleset === null || queuedPayoutLimitLoading) {
      return pairToDatum(t`Edit deadline`, current, null);
    }

    const upcomingBallotStrategy = upcomingRuleset?.approvalHook
      ? getApprovalStrategyByAddress(upcomingRuleset.approvalHook)
      : ruleset?.approvalHook ?
        getApprovalStrategyByAddress(ruleset.approvalHook)
      : undefined

    const upcoming = upcomingBallotStrategy?.name;
    return pairToDatum(t`Edit deadline`, current, upcoming);
  }, [ruleset?.approvalHook, upcomingRuleset, queuedPayoutLimitLoading]);

  return useMemo(() => {
    return {
      duration: durationDatum,
      startTime: startTimeDatum,
      payouts: payoutsDatum,
      editDeadline: editDeadlineDatum,
    };
  }, [durationDatum, startTimeDatum, editDeadlineDatum, payoutsDatum]);
};
