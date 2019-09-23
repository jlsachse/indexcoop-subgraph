import { SetTokenCreated }  from "../generated/SetCore/SetCore"
import { Set as SetDataSource } from "../generated/SetCore/templates"

export function handleSetCreated(event: SetTokenCreated): void {
	let address = event.params._setTokenAddress;

	SetDataSource.create(address);
}
