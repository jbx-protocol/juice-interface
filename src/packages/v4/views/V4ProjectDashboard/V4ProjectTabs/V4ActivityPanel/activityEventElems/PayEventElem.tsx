import { t } from "@lingui/macro";
import { NativeTokenValue, useJBTokenContext } from "juice-sdk-react";
import { PayEvent } from '../models/ActivityEvents';
import { ActivityEvent } from "./ActivityElement";

export default function PayEventElem({
  event
}: {
  event: PayEvent;
}) {
  const { token } = useJBTokenContext()

  return (
    <ActivityEvent
      event={{
        ...event,
        from: event.beneficiary,
      }}
      header={t`Paid`}
      subject={
        <span className="font-heading text-lg">
          <NativeTokenValue wei={event.amount.value} />
        </span>
      }
      extra={
        <span>
          bought {event.beneficiaryTokenCount?.format(6)}{' '}
          {token.data?.symbol ?? 'tokens'}
        </span>
      }
    />
  )
}
