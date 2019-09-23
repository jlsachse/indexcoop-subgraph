import { Bytes, BigInt } from "@graphprotocol/graph-ts"

import { LogPayableExchangeIssue } from "../generated/ProxyV2/TokenSetProxyV2"
import { Set as SetContract } from "../generated/SetCore/templates/Set/Set"
import { Set } from "../generated/schema"

export function handleSetIssue(event: LogPayableExchangeIssue): void {
	let address = event.params.rebalancingSetAddress;
	let set = Set.load(address.toHexString());
	if (!set) {
		let setContract = SetContract.bind(address);
		set = new Set(address.toHexString());

		set.address = address;
		set.name = setContract.name();
		set.symbol = setContract.symbol();
		set.supply = setContract.totalSupply();
		set.components = setContract.getComponents() as Array<Bytes>;
		set.units = setContract.getUnits();
		set.naturalUnit = setContract.naturalUnit();
	}
	set.save();
}
