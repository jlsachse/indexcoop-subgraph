import { Bytes } from "@graphprotocol/graph-ts"

import { LogRebalancingSetIssue } from "../generated/ProxyV1/TokenSetProxyV1"
import { TokenSet, Set } from "../generated/schema"

export function handleSetIssue(event: LogRebalancingSetIssue): void {
	let address = event.params.rebalancingSetAddress;
	let tokenSet = TokenSet.load(address.toHexString());
	if (!tokenSet) {
		tokenSet = new TokenSet(address.toHexString());
		tokenSet.set_ = address.toHexString();

		let set = Set.load(address.toHexString());
		let components = set.components as Array<Bytes>;
		tokenSet.underlyingSet = components[0].toHexString();

		tokenSet.save();
	}
}
