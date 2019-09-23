import { LogPayableExchangeIssue } from "../generated/ProxyV2/TokenSetProxyV2"
import { TokenSet } from "../generated/schema"

export function handleSetIssue(event: LogPayableExchangeIssue): void {
	let address = event.params.rebalancingSetAddress;
	let tokenSet = TokenSet.load(address.toHexString());
	if (!tokenSet) {
		tokenSet = new TokenSet(address.toHexString());
		tokenSet.set_ = address.toHexString();
		tokenSet.save();
	}
}
