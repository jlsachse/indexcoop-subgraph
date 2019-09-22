import { Bytes, BigInt } from "@graphprotocol/graph-ts"

import { LogRebalancingSetIssue } from "../generated/ProxyV1/TokenSetProxyV1"
import { Set } from "../generated/schema"

export function handleSetIssue(event: LogRebalancingSetIssue): void {
	let address = event.params.rebalancingSetAddress;
	let set = Set.load(address.toHexString());
	if (!set) {
		set = new Set(address.toHexString());
		set.address = address;
	}
	set.save();
}
