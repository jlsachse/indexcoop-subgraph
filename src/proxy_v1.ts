import { LogRebalancingSetIssue } from "../generated/ProxyV1/TokenSetProxyV1"
import { TokenSet } from "../generated/schema"

export function handleSetIssue(event: LogRebalancingSetIssue): void {
	let address = event.params.rebalancingSetAddress;
	let tokenSet = TokenSet.load(address.toHexString());
	if (!tokenSet) {
		tokenSet = new TokenSet(address.toHexString());
		tokenSet.set_ = address.toHexString();
		tokenSet.save();
	}
}
