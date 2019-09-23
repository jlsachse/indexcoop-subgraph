import { Bytes } from "@graphprotocol/graph-ts"

import { SetTokenCreated }  from "../generated/SetCore/SetCore"
import { Set as SetContract } from "../generated/SetCore/templates/Set/Set"
import { Set as SetDataSource } from "../generated/SetCore/templates"
import { Set } from "../generated/schema"

export function handleSetCreated(event: SetTokenCreated): void {
	let address = event.params._setTokenAddress;

	let set = new Set(address.toHexString());
	let setContract = SetContract.bind(address);

	set.address = address;
	set.name = setContract.name();
	set.symbol = setContract.symbol();
	set.supply = setContract.totalSupply();
	set.components = setContract.getComponents() as Array<Bytes>;
	set.units = setContract.getUnits();
	set.naturalUnit = setContract.naturalUnit();
	set.save();

	SetDataSource.create(address);
}
