import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

import { SetTokenCreated }  from "../generated/SetCore/SetCore";
import { Set as SetContract } from "../generated/templates/Set/Set";
import { Set as SetDataSource } from "../generated/templates";
import { Set, TokenSet } from "../generated/schema";

export function handleSetCreated(event: SetTokenCreated): void {
	let address = event.params._setTokenAddress;

	let set = new Set(address.toHexString());
	let setContract = SetContract.bind(address);

	set.address = address;
	set.name = setContract.name();
	set.symbol = setContract.symbol();
	set.supply = new BigInt(0);
	set.components = setContract.getComponents() as Array<Bytes>;
	set.units = setContract.getUnits();
	set.naturalUnit = setContract.naturalUnit();
	set.save();

	if (_isTokenSet(address)) {
		let tokenSet = new TokenSet(address.toHexString());
		tokenSet.set_ = address.toHexString();

		let components = set.components as Array<Bytes>;
		tokenSet.underlyingSet = components[0].toHexString();
		tokenSet.save();
	}

	SetDataSource.create(address);
}

function _isTokenSet(address: Address): boolean {
	let tokenSets: Array<String> = [
		'0x136fae4333ea36a24bb751e2d505d6ca4fd9f00b',
		'0x20649d97b1393105cf92a5083fd2aff7c99ebe56',
		'0x2c5a9980b41861d91d30d0e0271d1c093452dca5',
		'0x316b13b951efe25aad1cb565385b23869a7d4c48',
		'0x585c2cf94c41b528ec7329cbc3cde3c4f8d268db',
		'0x5cd487ce4db7091292f2e914f7b31445bd4a5e1b',
		'0x6123a0cbc95cb157995a0795187a60995b85e0a9',
		'0x614857c755739354d68ae0abd53849cf45d6a41d',
		'0x81c55017f7ce6e72451ced49ff7bab1e3df64d0c',
		'0x8ddc86dba7ad728012efc460b8a168aba60b403b',
		'0x93e01899c10532d76c0e864537a1d26433dbbddb',
		'0x9ea463ec4ce9e9e5bc9cfd0187c4ac3a70dd951d',
		'0xa35fc5019c4dc509394bd4d74591a0bf8852c195',
		'0xa360f2af3f957906468c0fd7526391aed08ae3db',
		'0xa6c040045d962e4b8efa00954c7d23ccd0a2b8ad',
		'0xac1565e473f69fada09661a6b4103fbbf801ceee',
		'0xb9ffe0b8ee2d1af94202ffed366520300748a4d8',
		'0xbf70a33a13fbe8d0106df321da0cf654d2e9ab50',
		'0xc06aec5191be16b94ffc97b6fc01393527367365',
		'0xef0fda1d4bd73ddc2f93a4e46e2e5adbc2d668f4',
		'0xf1e5f03086e1c0ce55e54cd8146bc9c28435346f',
	];
	return tokenSets.includes(address.toHexString());
}
