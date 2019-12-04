import { Address, BigInt } from "@graphprotocol/graph-ts"

import { TokenSet, Set, Issuance, Redemption, Rebalance, Transfer, Balance, User } from "../generated/schema"
import {
	Transfer as TransferEvent,
	RebalanceStarted,
	SettleRebalanceCall,
	Set as SetContract,
}  from "../generated/templates/Set/Set";

let zeroAddress = Address.fromString('0x0000000000000000000000000000000000000000');

export function handleTransfer(event: TransferEvent): void {
	let id = event.transaction.hash.toHexString() + '-' + event.logIndex.toString();
	let from = event.params.from;
	let to  = event.params.to;
	let value = event.params.value;

	let setAddress = event.address;
	let set = Set.load(setAddress.toHexString());

	// Mint
	if (from == zeroAddress) {
		let issuance = new Issuance(id);
		issuance.set_ = setAddress.toHexString();
		issuance.amount = value;
		issuance.account = to;
		issuance.timestamp = event.block.timestamp;
		issuance.save();

		let set = Set.load(setAddress.toHexString());
		set.supply += value;
		set.save();
	}

	// Burn
	if (to == zeroAddress) {
		let redemption = new Redemption(id);
		redemption.set_ = setAddress.toHexString();
		redemption.amount = value;
		redemption.account = from;
		redemption.timestamp = event.block.timestamp;
		redemption.save();

		let set = Set.load(setAddress.toHexString());
		set.supply -= value;
		set.save();
	}

	// Transfer
	if (from != zeroAddress && to != zeroAddress) {
		let transfer = new Transfer(id);
		transfer.set_ = setAddress.toHexString();
		transfer.from = from;
		transfer.to = to;
		transfer.value = value;
		transfer.timestamp = event.block.timestamp;
		transfer.save();
	}

	// Balances
	if (from != zeroAddress) {
		let user = User.load(from.toHexString());
		if (!user) {
			user = new User(from.toHexString());
		}
		user.save();

		let balanceId = from.toHexString() + '-' + setAddress.toHexString();
		let balance = Balance.load(balanceId);
		if (!balance) {
			balance = new Balance(balanceId);
			balance.set_ = setAddress.toHexString();
			balance.user = from.toHexString();
			balance.balance = new BigInt(0);
		}
		balance.balance -= value;
		balance.save();
	}

	if (to != zeroAddress) {
		let user = User.load(to.toHexString());
		if (!user) {
			user = new User(to.toHexString());
		}
		user.save();

		let balanceId = to.toHexString() + '-' + setAddress.toHexString();
		let balance = Balance.load(balanceId);
		if (!balance) {
			balance = new Balance(balanceId);
			balance.set_ = setAddress.toHexString();
			balance.user = to.toHexString();
			balance.balance = new BigInt(0);
		}
		balance.balance += value;
		balance.save();
	}
}

export function handleRebalanceStart(event: RebalanceStarted): void {
	let id = event.transaction.hash.toHexString() + '-' + event.logIndex.toString();
	let setAddress = event.address;

	let rebalance = new Rebalance(id);
	rebalance.set_ = setAddress.toHexString();
	rebalance.oldSet = event.params.oldSet.toHexString();
	rebalance.newSet = event.params.newSet.toHexString();
	rebalance.timestamp = event.block.timestamp;
	rebalance.save();

	let set = Set.load(setAddress.toHexString());
	set.components = [ event.params.newSet ];
	set.save();

	let tokenSet = TokenSet.load(setAddress.toHexString());
	if (tokenSet) {
		tokenSet.underlyingSet = event.params.newSet.toHexString();
		tokenSet.save();
	}
}

export function handleRebalanceSettle(call: SettleRebalanceCall): void {
	let setAddress = call.to;

	let set = Set.load(setAddress.toHexString());
	let setContract = SetContract.bind(setAddress);
	set.units = setContract.getUnits();
	set.save();
}
