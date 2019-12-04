import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"

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

	if (isTokenSet(setAddress)) {
		let tokenSet = TokenSet.load(setAddress.toHexString());
		if (!tokenSet) {
			tokenSet = new TokenSet(setAddress.toHexString());
			tokenSet.set_ = setAddress.toHexString();

			let components = set.components as Array<Bytes>;
			tokenSet.underlyingSet = components[0].toHexString();
			tokenSet.save();
		}
	}

	// Mint
	if (from == zeroAddress) {
		if (isTokenSet(setAddress)) {
			let issuance = new Issuance(id);
			issuance.set_ = setAddress.toHexString();
			issuance.amount = value;
			issuance.account = to;
			issuance.timestamp = event.block.timestamp;
			issuance.save();
		}

		let set = Set.load(setAddress.toHexString());
		set.supply += value;
		set.save();
	}

	// Burn
	if (to == zeroAddress) {
		if (isTokenSet(setAddress)) {
			let redemption = new Redemption(id);
			redemption.set_ = setAddress.toHexString();
			redemption.amount = value;
			redemption.account = from;
			redemption.timestamp = event.block.timestamp;
			redemption.save();
		}

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
		if (isTokenSet(setAddress)) {
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
	}

	if (to != zeroAddress) {
		if (isTokenSet(setAddress)) {
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
}

export function handleRebalanceStart(event: RebalanceStarted): void {
	let id = event.transaction.hash.toHexString() + '-' + event.logIndex.toString();
	let setAddress = event.address;

	if (isTokenSet(setAddress)) {
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
}

export function handleRebalanceSettle(call: SettleRebalanceCall): void {
	let setAddress = call.to;

	if (isTokenSet(setAddress)) {
		let set = Set.load(setAddress.toHexString());
		let setContract = SetContract.bind(setAddress);
		set.units = setContract.getUnits();
		set.save();
	}
}

function isTokenSet(address: Address): boolean {
	let tokenSets: Array<String> = [
		'0x20649d97b1393105cf92a5083fd2aff7c99ebe56',
		'0x2c5a9980b41861d91d30d0e0271d1c093452dca5',
		'0x585c2cf94c41b528ec7329cbc3cde3c4f8d268db',
		'0x5cd487ce4db7091292f2e914f7b31445bd4a5e1b',
		'0x6123a0cbc95cb157995a0795187a60995b85e0a9',
		'0x614857c755739354d68ae0abd53849cf45d6a41d',
		'0x81c55017f7ce6e72451ced49ff7bab1e3df64d0c',
		'0x8ddc86dba7ad728012efc460b8a168aba60b403b',
		'0x93e01899c10532d76c0e864537a1d26433dbbddb',
		'0x9ea463ec4ce9e9e5bc9cfd0187c4ac3a70dd951d',
		'0xa35fc5019c4dc509394bd4d74591a0bf8852c195',
		'0xa360f2af3f957906468c0fd7526391aed08ae3db',
		'0xa6c040045d962e4b8efa00954c7d23ccd0a2b8ad',
		'0xac1565e473f69fada09661a6b4103fbbf801ceee',
		'0xb9ffe0b8ee2d1af94202ffed366520300748a4d8',
		'0xc06aec5191be16b94ffc97b6fc01393527367365',
		'0xf1e5f03086e1c0ce55e54cd8146bc9c28435346f',
	];
	return tokenSets.includes(address.toHexString());
}
