import { Issuance, Redemption, Set } from "../generated/schema"
import { Transfer }  from "../generated/ProxyV1/templates/Set/Set"

export function handleTransfer(event: Transfer): void {
	let id = event.transaction.hash.toHexString() + '-' + event.logIndex.toString();
	let from = event.params.from;
	let to  = event.params.to;
	let zeroAddress = '0x0000000000000000000000000000000000000000';
	if (from.toHexString() == zeroAddress) {
		// Mint
		let issuance = new Issuance(id);
		issuance.set_ = event.address.toHexString();
		issuance.amount = event.params.value;
		issuance.account = to;
		issuance.timestamp = event.block.timestamp;
		issuance.save();

		let set = Set.load(issuance.set_);
		set.supply += issuance.amount;
		set.save();
	}
	if (to.toHexString() == zeroAddress) {
		// Burn
		let redemption = new Redemption(id);
		redemption.set_ = event.address.toHexString();
		redemption.amount = event.params.value;
		redemption.account = from;
		redemption.timestamp = event.block.timestamp;
		redemption.save();

		let set = Set.load(redemption.set_);
		set.supply -= redemption.amount;
		set.save();
	}
}
