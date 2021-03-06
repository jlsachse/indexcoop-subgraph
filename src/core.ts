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
	let roboSets: Array<String> = [
		'0x0329d23fc7b1b1e6cca57afa3f0090f1189069e8',
		'0x136fae4333ea36a24bb751e2d505d6ca4fd9f00b',
		'0x20649d97b1393105cf92a5083fd2aff7c99ebe56',
		'0x2c5a9980b41861d91d30d0e0271d1c093452dca5',
		'0x316b13b951efe25aad1cb565385b23869a7d4c48',
		'0x585c2cf94c41b528ec7329cbc3cde3c4f8d268db',
		'0x5cd487ce4db7091292f2e914f7b31445bd4a5e1b',
		'0x6123a0cbc95cb157995a0795187a60995b85e0a9',
		'0x614857c755739354d68ae0abd53849cf45d6a41d',
		'0x81c55017f7ce6e72451ced49ff7bab1e3df64d0c',
		'0x8933ea1ce67b946bdf2436ce860ffbb53ce814d2',
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
	let socialSets: Array<String> = [
		'0x09ae0c4c34a09875660e681fe1890f3b35175151',
		'0x09e4bdfb273245063ef5e800d891eff7d04f9b83',
		'0x1003ec54f51565ff86ac611184ea23d6310cae71',
		'0x15822a64c8cb27d7828c45e0aafc3e6c5decd172',
		'0x1ce9200c98b6d9999b60bff53860475a993a8b68',
		'0x1f6321308df0f437133d2c083f6583b2fcf8125b',
		'0x253444bd9ecf11e5516d6d00974e91c9f0857ccb',
		'0x28c6a58c2a5d8c5f6681e07bfa0ada4bea14c9ee',
		'0x2bf417fda6e73b8ea605df0f33ad029f8d4b795a',
		'0x33319fae07128119166476a4bcdd96e5c9401ca4',
		'0x3e6941521c85c7233632bf76e3adb05db8e2f1db',
		'0x41f3b2b6d4d122e81834582a3f3367388def95cf',
		'0x542156d51d10db5accb99f9db7e7c91b74e80a2c',
		'0x58723c7afcd33a2db6ae06c37521725d65f0cc15',
		'0x5958107be1ecc8d0d1593b3d7cc75f5e48304682',
		'0x654424f4b3ed6de828c9ca30484dc1a626bb5fba',
		'0x6ad29bde4ecc382e8d535206f1f0dd92a6c034df',
		'0x73104e9d3da91e410a6c211068f7bffabbbd3e26',
		'0x78e14b9a8d006ec7e23988a0a87263569c3f4839',
		'0x7b8d9e95caa85d7905c3435da1ba9fa7f79bf4fa',
		'0x80af3f06aefb9f436981cb12b9da35c5da023efd',
		'0x856c4388c56c2a613c60507a4701af627157fed6',
		'0x89c0b027bd7cc2d17854b06f8322e29451192ce3',
		'0x8a63be90f095f6777be3ed25d9fc7cd2a63ddb30',
		'0x8abf3a95862619a55fa00cb3e4eedbe113ff468c',
		'0x8c7c047051f37746bb1dcd16ae37851a3891635c',
		'0x8d66df717faf06c07b5d3e53ffd3ea66d612e150',
		'0x90f49083ff588ec5a5459f4d2a64b8d409c03122',
		'0x9709bb5ce25fcd6f9786d3e4ccf422717367473c',
		'0xa12a696b9b11788076a6cb384cac6986b82545e1',
		'0xaaa4eb35d08dbb9b1b8760cb9ffe77b9023d7511',
		'0xabc754ac2161b557d28062f41dcc0fc18440ac7e',
		'0xac6560df686f3ac7039b0dd6867c874c99d9da06',
		'0xac8ea871e2d5f4be618905f36f73c760f8cfdc8e',
		'0xb1ca7e6714263a64659a3a89e1c313af30fd660a',
		'0xb272422b7d07b94859ad61e4435c6d5087f308de',
		'0xb32c960c46f28059c2b5f1c3ecc2b9dd77ab0aa0',
		'0xb8243b4eeca27a4191e879760b88fe2270561796',
		'0xba8ea15b647f54d9ff849670fcaacf35df21a457',
		'0xbddd682e63dd9f9fa3b97aea88772e77cf3e5013',
		'0xc19216eea17b2f4dd677f1024cda59c7d142f189',
		'0xc7d79021cd127a2f35b1e26fe3c4aad67f5c28b8',
		'0xcae169afde69f297c7817ed5f4a6816c0e38137d',
		'0xcf50bc1442a50d1756b34119fe1e26325aa648e3',
		'0xd218d75ba0fc45858a4e9ef57a257ed9977db5f4',
		'0xd235e29b1dd177cd74f2955d081204a6cd04515e',
		'0xd9c6d58ec4b6045067190042999351889fd27eb7',
		'0xdbf5c7d8ac5007667617a15db2c1b1d616c9d302',
		'0xdc5bbcf8189a69337f693a9f3f63ae37789ede92',
		'0xdd7ae9466c9caad4bf632f796eaf4287f9616a7a',
		'0xe0a84699a583d467001fcfe1d52930cf6f3b0bfa',
		'0xe33a35fd5cad21ce72ebbc8a2885bdd0983de043',
		'0xe6404a4472e5222b440f8fafb795553046000841',
		'0xe86811516f9e46f6f2a8a19754c893ded414d682',
		'0xf23e4cbfab1871aeb0f3c1e327ff0051f1f178ec',
		'0xf43b2f981efc5a611a97951ce4fd7d3bd87f4902',
		'0xffee21b4bb7084a9416205544101ae9f472c7159',
	];
	let tokenSets = roboSets.concat(socialSets);
	return tokenSets.includes(address.toHexString());
}
