import { Bytes, BigInt } from "@graphprotocol/graph-ts"

import { LogPayableExchangeIssue } from "../generated/ProxyV2/TokenSetProxyV2"
import { Set } from "../generated/schema"

export function handleSetIssue(event: LogPayableExchangeIssue): void {
	let address = event.params.rebalancingSetAddress;
	let set = Set.load(address.toHexString());
	if (!set) {
		set = new Set(address.toHexString());
		set.address = address;
	}
	set.save();
}
