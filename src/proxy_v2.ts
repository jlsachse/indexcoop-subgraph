import { Bytes } from "@graphprotocol/graph-ts"

import { LogPayableExchangeIssue } from "../generated/ProxyV2/TokenSetProxyV2"
import { TokenSet, Set } from "../generated/schema"

export function handleSetIssue(event: LogPayableExchangeIssue): void {
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
