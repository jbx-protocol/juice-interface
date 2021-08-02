import { BigInt } from "@graphprotocol/graph-ts";

import { Create, SetHandle, SetUri } from "../generated/Projects/Projects";
import {
  ConfigureEvent,
  PayEvent,
  PrintPremineEvent,
  PrintReservesEvent,
  Project,
  ProjectStat,
  RedeemEvent,
  TapEvent,
} from "../generated/schema";
import {
  AddToBalance,
  AllowMigration,
  AppointGovernance,
  Configure,
  Deposit,
  DistributeToPayoutMod,
  DistributeToTicketMod,
  EnsureTargetLocalWei,
  Migrate,
  Pay,
  PrintPreminedTickets,
  PrintReserveTickets,
  Redeem,
  SetFee,
  SetTargetLocalWei,
  SetYielder,
  Tap,
} from "../generated/TerminalV1/TerminalV1";

export function handleProjectCreate(event: Create): void {
  let project = new Project(event.params.projectId.toHexString());
  project.handle = event.params.handle.toHexString();
  project.owner = event.params.owner;
  project.createdAt = event.block.timestamp;
  project.uri = event.params.uri;
  project.save();

  let stat = new ProjectStat(event.params.projectId.toHexString());
  stat.totalPaid = new BigInt(0);
  stat.totalRedeemed = new BigInt(0);
  stat.save();
}

export function handleSetHandle(event: SetHandle): void {
  let project = Project.load(event.params.projectId.toHexString());
  project.handle = event.params.handle.toHexString();
  project.save();
}

export function handleSetUri(event: SetUri): void {
  let project = Project.load(event.params.projectId.toHexString());
  project.uri = event.params.uri;
  project.save();
}

export function handlePay(event: Pay): void {
  let timestamp = event.block.timestamp;
  let caller = event.params.caller;

  let pay = new PayEvent(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  pay.amount = event.params.amount;
  pay.beneficiary = event.params.beneficiary;
  pay.caller = caller;
  pay.fundingCycleId = event.params.fundingCycleId;
  pay.projectId = event.params.projectId;
  pay.note = event.params.note;
  pay.timestamp = timestamp;
  pay.txHash = event.transaction.hash;
  pay.save();

  let stat = ProjectStat.load(event.params.projectId.toHexString());
  stat.totalPaid = stat.totalPaid.plus(event.params.amount);
  stat.save();
}

export function handlePrintPreminedTickets(event: PrintPreminedTickets): void {
  let printPremine = new PrintPremineEvent(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  printPremine.amount = event.params.amount;
  printPremine.beneficiary = event.params.beneficiary;
  printPremine.caller = event.params.caller;
  printPremine.currency = event.params.currency;
  printPremine.memo = event.params.memo;
  printPremine.projectId = event.params.projectId;
  printPremine.timestamp = event.block.timestamp;
  printPremine.txHash = event.transaction.hash;
  printPremine.save();
}

export function handleTap(event: Tap): void {
  let tapEvent = new TapEvent(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  tapEvent.amount = event.params.amount;
  tapEvent.beneficiary = event.params.beneficiary;
  tapEvent.beneficiaryTransferAmount = event.params.beneficiaryTransferAmount;
  tapEvent.caller = event.params.caller;
  tapEvent.currency = event.params.currency;
  tapEvent.fundingCycleId = event.params.fundingCycleId;
  tapEvent.govFeeAmount = event.params.govFeeAmount;
  tapEvent.netTransferAmount = event.params.netTransferAmount;
  tapEvent.projectId = event.params.projectId;
  tapEvent.timestamp = event.block.timestamp;
  tapEvent.txHash = event.transaction.hash;
  tapEvent.save();
}

export function handleRedeem(event: Redeem): void {
  let timestamp = event.block.timestamp;
  let caller = event.params.caller;

  let redeemEvent = new RedeemEvent(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  redeemEvent.amount = event.params.amount;
  redeemEvent.beneficiary = event.params.beneficiary;
  redeemEvent.caller = caller;
  redeemEvent.holder = event.params.holder;
  redeemEvent.returnAmount = event.params.returnAmount;
  redeemEvent.projectId = event.params._projectId;
  redeemEvent.timestamp = timestamp;
  redeemEvent.txHash = event.transaction.hash;
  redeemEvent.save();

  let stat = ProjectStat.load(event.params._projectId.toHexString());
  stat.totalRedeemed = stat.totalRedeemed.plus(event.params.amount);
  stat.save();
}

export function handlePrintReserveTickets(event: PrintReserveTickets): void {
  let printReserveEvent = new PrintReservesEvent(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  printReserveEvent.beneficiary = event.params.beneficiary;
  printReserveEvent.beneficiaryTicketAmount =
    event.params.beneficiaryTicketAmount;
  printReserveEvent.caller = event.params.caller;
  printReserveEvent.count = event.params.count;
  printReserveEvent.fundingCycleId = event.params.fundingCycleId;
  printReserveEvent.projectId = event.params.projectId;
  printReserveEvent.timestamp = event.block.timestamp;
  printReserveEvent.txHash = event.transaction.hash;
  printReserveEvent.save();
}

export function handleConfigure(event: Configure): void {
  let configureEvent = new ConfigureEvent(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  configureEvent.caller = event.params.caller;
  configureEvent.fundingCycleId = event.params.fundingCycleId;
  configureEvent.projectId = event.params.projectId;
  configureEvent.timestamp = event.block.timestamp;
  configureEvent.txHash = event.transaction.hash;
  configureEvent.save();
}

export function handleAddToBalance(event: AddToBalance): void {}

export function handleAllowMigration(event: AllowMigration): void {}

export function handleAppointGovernance(event: AppointGovernance): void {}

export function handleDeposit(event: Deposit): void {}

export function handleDistributeToPayoutMod(
  event: DistributeToPayoutMod
): void {}

export function handleDistributeToTicketMod(
  event: DistributeToTicketMod
): void {}

export function handleEnsureTargetLocalWei(event: EnsureTargetLocalWei): void {}

export function handleMigrate(event: Migrate): void {}

export function handleSetFee(event: SetFee): void {}

export function handleSetTargetLocalWei(event: SetTargetLocalWei): void {}

export function handleSetYielder(event: SetYielder): void {}

// export function handleAcceptGovernance(event: AcceptGovernance): void {
//   // Entities can be loaded from the store using a string ID; this ID
//   // needs to be unique across all entities of the same type
//   let entity = ExampleEntity.load(event.transaction.from.toHex())

//   // Entities only exist after they have been saved to the store;
//   // `null` checks allow to create entities on demand
//   if (entity == null) {
//     entity = new ExampleEntity(event.transaction.from.toHex())

//     // Entity fields can be set using simple assignments
//     entity.count = BigInt.fromI32(0)
//   }

//   // BigInt and BigDecimal math are supported
//   entity.count = entity.count + BigInt.fromI32(1)

//   // Entity fields can be set based on event parameters
//   entity.governance = event.params.governance

//   // Entities can be written to the store with `.save()`
//   entity.save()

//   // Note: If a handler doesn't require existing field values, it is faster
//   // _not_ to load the entity from the store. Instead, create it fresh with
//   // `new Entity(...)`, set the fields that should be updated and save the
//   // entity back to the store. Fields that were not set or unset remain
//   // unchanged, allowing for partial updates to be applied.

//   // It is also possible to access smart contracts from mappings. For
//   // example, the contract that has emitted the event can be connected to
//   // with:
//   //
//   // let contract = Contract.bind(event.address)
//   //
//   // The following functions can then be called on this contract to access
//   // state variables and other data:
//   //
//   // - contract.balanceOf(...)
//   // - contract.canPrintPreminedTickets(...)
//   // - contract.claimableOverflowOf(...)
//   // - contract.configure(...)
//   // - contract.currentOverflowOf(...)
//   // - contract.fee(...)
//   // - contract.fundingCycles(...)
//   // - contract.governance(...)
//   // - contract.migrationIsAllowed(...)
//   // - contract.modStore(...)
//   // - contract.operatorStore(...)
//   // - contract.pendingGovernance(...)
//   // - contract.prices(...)
//   // - contract.printReservedTickets(...)
//   // - contract.projects(...)
//   // - contract.redeem(...)
//   // - contract.reservedTicketBalanceOf(...)
//   // - contract.tap(...)
//   // - contract.terminalDirectory(...)
//   // - contract.ticketBooth(...)
// }
