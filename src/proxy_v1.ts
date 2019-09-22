import { Bytes, BigInt } from "@graphprotocol/graph-ts"

import { LogRebalancingSetIssue } from "../generated/ProxyV1/TokenSetProxyV1"
import { Set as SetContract } from "../generated/ProxyV1/templates/Set/Set"
import { Set as SetDataSource } from "../generated/ProxyV1/templates"
import { Set } from "../generated/schema"

export function handleSetIssue(event: LogRebalancingSetIssue): void {
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

		SetDataSource.create(address);
	}
	set.save();
}
