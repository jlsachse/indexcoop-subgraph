import { BigInt, Bytes } from "@graphprotocol/graph-ts"

import { SetTokenCreated }  from "../generated/SetCore/SetCore"
import { Set as SetContract } from "../generated/templates/Set/Set"
import { Set as SetDataSource } from "../generated/templates"
import { Set } from "../generated/schema"

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

	SetDataSource.create(address);
}
