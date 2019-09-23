import { Address } from "@graphprotocol/graph-ts"

import { Set, Issuance, Redemption, Rebalance } from "../generated/schema"
import { Transfer, Set as SetContract }  from "../generated/ProxyV1/templates/Set/Set"
import { SetCore as SetCoreContract } from "../generated/SetCore/SetCore"

export function handleTransfer(event: Transfer): void {
	let id = event.transaction.hash.toHexString() + '-' + event.logIndex.toString();
	let from = event.params.from;
	let to  = event.params.to;
	let value = event.params.value;
	let zeroAddress = '0x0000000000000000000000000000000000000000';

	let setAddress = event.address;

	if (from.toHexString() == zeroAddress) {
		// Mint
		let issuance = new Issuance(id);
		issuance.set_ = setAddress.toHexString();
		issuance.amount = value;
		issuance.account = to;
		issuance.timestamp = event.block.timestamp;
		issuance.save();

		let set = Set.load(setAddress.toHexString());
		let setContract = SetContract.bind(setAddress);
		set.supply = setContract.totalSupply();
		set.save();

		if (isSet(to)) {
			// rebalance settled
			let rebalances = set.rebalances as Array<String>;
			let rebalanceId = rebalances[rebalances.length - 1];
			let rebalance = Rebalance.load(rebalanceId);
			rebalance.toSet = to.toHexString();
			rebalance.toAmount = value;
			rebalance.settleTimestamp = event.block.timestamp;
			rebalance.save();
		}
	}
	if (to.toHexString() == zeroAddress) {
		// Burn
		let redemption = new Redemption(id);
		redemption.set_ = setAddress.toHexString();
		redemption.amount = value;
		redemption.account = from;
		redemption.timestamp = event.block.timestamp;
		redemption.save();

		let set = Set.load(setAddress.toHexString());
		let setContract = SetContract.bind(setAddress);
		set.supply = setContract.totalSupply();
		set.save();

		if (isSet(from)) {
			// rebalance started
			let rebalance = new Rebalance(id);
			rebalance.set_ = setAddress.toHexString();
			rebalance.fromSet = from.toHexString();
			rebalance.fromAmount = value;
			rebalance.startTimestamp = event.block.timestamp;
			rebalance.save();
		}
	}
}

function isSet(address: Address): boolean {
	let setCoreAddress = Address.fromString('0xf55186CC537E7067EA616F2aaE007b4427a120C8');
	let setCoreContract = SetCoreContract.bind(setCoreAddress);
	let setTokens = setCoreContract.setTokens();
	for (let i = 0; i < setTokens.length; i++) {
		if (setTokens[i].toHexString() == address.toHexString()) {
			return true;
		}
	}
	return false;
}
