import { BigInt } from "@graphprotocol/graph-ts";

import { Create, SetHandle, SetUri } from "../generated/Projects/Projects";
import {
  DistributeToPayoutModEvent,
  DistributeToTicketModEvent,
  PayerReport,
  PayEvent,
  PrintPremineEvent,
  PrintReservesEvent,
  Project,
  RedeemEvent,
  TapEvent,
} from "../generated/schema";
import {
  AddToBalance,
  AllowMigration,
  AppointGovernance,
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

/**
 * Check health of deployed subgraph
 * curl -X POST -d '{ "query": "{indexingStatuses(subgraphs: [\"Qma55qUEASRbpSAGupaKSd9XZxz6Fk9hNjFoTRY3XSV8fF\"]) {synced health fatalError {message block { number } handler } subgraph chains { chainHeadBlock { number } latestBlock { number }}}}"}' https://api.thegraph.com/index-node/graphql
 */

export function handleProjectCreate(event: Create): void {
  let project = new Project(event.params.projectId.toHexString());
  project.handle = event.params.handle.toHexString();
  project.creator = event.params.owner;
  project.createdAt = event.block.timestamp;
  project.uri = event.params.uri;
  project.totalPaid = new BigInt(0);
  project.totalRedeemed = new BigInt(0);
  project.currentBalance = new BigInt(0);
  project.save();
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
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  );
  let projectId = event.params.projectId.toHexString();
  pay.amount = event.params.amount;
  pay.beneficiary = event.params.beneficiary;
  pay.caller = caller;
  pay.fundingCycleId = event.params.fundingCycleId;
  pay.project = projectId;
  pay.note = event.params.note;
  pay.timestamp = timestamp;
  pay.txHash = event.transaction.hash;
  pay.save();

  let project = Project.load(projectId);
  project.totalPaid = project.totalPaid.plus(event.params.amount);
  project.currentBalance = project.currentBalance.plus(event.params.amount);

  let payerReportId = event.params.beneficiary.toHexString() + "-" + projectId;
  let payerReport = PayerReport.load(payerReportId);
  if (payerReport === null) {
    payerReport = new PayerReport(payerReportId);
    payerReport.payer = event.params.beneficiary;
    payerReport.totalPaid = event.params.amount;
    payerReport.project = project.id;
  } else {
    payerReport.totalPaid = event.params.amount.plus(payerReport.totalPaid);
  }
  payerReport.lastPaidTimestamp = event.block.timestamp;

  payerReport.save();
  project.save();
}

export function handlePrintPreminedTickets(event: PrintPreminedTickets): void {
  let printPremine = new PrintPremineEvent(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  );
  printPremine.amount = event.params.amount;
  printPremine.beneficiary = event.params.beneficiary;
  printPremine.caller = event.params.caller;
  printPremine.currency = event.params.currency;
  printPremine.memo = event.params.memo;
  printPremine.project = event.params.projectId.toHexString();
  printPremine.timestamp = event.block.timestamp;
  printPremine.txHash = event.transaction.hash;
  printPremine.save();
}

export function handleTap(event: Tap): void {
  let tapEvent = new TapEvent(
    event.params.projectId.toHexString() +
      "-" +
      event.transaction.hash.toHexString()
  );
  let project = Project.load(event.params.projectId.toHexString());

  tapEvent.amount = event.params.amount;
  tapEvent.beneficiary = event.params.beneficiary;
  tapEvent.beneficiaryTransferAmount = event.params.beneficiaryTransferAmount;
  tapEvent.caller = event.params.caller;
  tapEvent.currency = event.params.currency;
  tapEvent.fundingCycleId = event.params.fundingCycleId;
  tapEvent.govFeeAmount = event.params.govFeeAmount;
  tapEvent.netTransferAmount = event.params.netTransferAmount;
  tapEvent.project = event.params.projectId.toHexString();
  tapEvent.timestamp = event.block.timestamp;
  tapEvent.txHash = event.transaction.hash;
  tapEvent.save();

  project.currentBalance = project.currentBalance
    .minus(event.params.govFeeAmount)
    .minus(event.params.netTransferAmount);
  project.save();
}

export function handleRedeem(event: Redeem): void {
  let timestamp = event.block.timestamp;
  let caller = event.params.caller;

  let redeemEvent = new RedeemEvent(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  );
  redeemEvent.amount = event.params.amount;
  redeemEvent.beneficiary = event.params.beneficiary;
  redeemEvent.caller = caller;
  redeemEvent.holder = event.params.holder;
  redeemEvent.returnAmount = event.params.returnAmount;
  redeemEvent.project = event.params._projectId.toHexString();
  redeemEvent.timestamp = timestamp;
  redeemEvent.txHash = event.transaction.hash;
  redeemEvent.save();

  let project = Project.load(event.params._projectId.toHexString());
  project.totalRedeemed = project.totalRedeemed.plus(event.params.returnAmount);
  project.currentBalance = project.currentBalance.minus(
    event.params.returnAmount
  );
  project.save();
}

export function handlePrintReserveTickets(event: PrintReserveTickets): void {
  let printReserveEvent = new PrintReservesEvent(
    event.params.projectId.toHexString() +
      "-" +
      event.transaction.hash.toHexString()
  );

  printReserveEvent.beneficiary = event.params.beneficiary;
  printReserveEvent.beneficiaryTicketAmount =
    event.params.beneficiaryTicketAmount;
  printReserveEvent.caller = event.params.caller;
  printReserveEvent.count = event.params.count;
  printReserveEvent.fundingCycleId = event.params.fundingCycleId;
  printReserveEvent.project = event.params.projectId.toHexString();
  printReserveEvent.timestamp = event.block.timestamp;
  printReserveEvent.txHash = event.transaction.hash;
  printReserveEvent.save();
}

// export function handleConfigure(event: Configure): void {
//   let configureEvent = new ConfigureEvent(
//     event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
//   );
//   configureEvent.caller = event.params.caller;
//   configureEvent.fundingCycleId = event.params.fundingCycleId;
//   configureEvent.project = event.params.projectId.toHexString();
//   configureEvent.timestamp = event.block.timestamp;
//   configureEvent.txHash = event.transaction.hash;
//   configureEvent.save();
// }

export function handleAddToBalance(event: AddToBalance): void {
  let project = Project.load(event.params.projectId.toHexString());
  project.currentBalance = project.currentBalance.plus(event.params.value);
  project.save();
}

export function handleDistributeToPayoutMod(
  event: DistributeToPayoutMod
): void {
  let distributeToPayoutModEvent = new DistributeToPayoutModEvent(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  );

  distributeToPayoutModEvent.tapEvent =
    event.params.projectId.toHexString() +
    "-" +
    event.transaction.hash.toHexString();
  distributeToPayoutModEvent.project = event.params.projectId.toHexString();
  distributeToPayoutModEvent.caller = event.params.caller;
  distributeToPayoutModEvent.projectId = event.params.projectId;
  distributeToPayoutModEvent.fundingCycleId = event.params.fundingCycleId;
  distributeToPayoutModEvent.modProjectId = event.params.mod.projectId;
  distributeToPayoutModEvent.modBeneficiary = event.params.mod.beneficiary;
  distributeToPayoutModEvent.modAllocator = event.params.mod.allocator;
  distributeToPayoutModEvent.modPreferUnstaked =
    event.params.mod.preferUnstaked;
  distributeToPayoutModEvent.modCut = event.params.modCut;
  distributeToPayoutModEvent.timestamp = event.block.timestamp;
  distributeToPayoutModEvent.txHash = event.transaction.hash;

  distributeToPayoutModEvent.save();
}

export function handleDistributeToTicketMod(
  event: DistributeToTicketMod
): void {
  let distributeToTicketModEvent = new DistributeToTicketModEvent(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  );

  distributeToTicketModEvent.printReservesEvent =
    event.params.projectId.toHexString() +
    "-" +
    event.transaction.hash.toHexString();
  distributeToTicketModEvent.caller = event.params.caller;
  distributeToTicketModEvent.modBeneficiary = event.params.mod.beneficiary;
  distributeToTicketModEvent.modPreferUnstaked =
    event.params.mod.preferUnstaked;
  distributeToTicketModEvent.modCut = event.params.modCut;
  distributeToTicketModEvent.projectId = event.params.projectId;
  distributeToTicketModEvent.fundingCycleId = event.params.fundingCycleId;
  distributeToTicketModEvent.txHash = event.transaction.hash;
  distributeToTicketModEvent.timestamp = event.block.timestamp;
  distributeToTicketModEvent.project = event.params.projectId.toHexString();

  distributeToTicketModEvent.save();
}

export function handleAllowMigration(event: AllowMigration): void {}

export function handleAppointGovernance(event: AppointGovernance): void {}

export function handleDeposit(event: Deposit): void {}

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
