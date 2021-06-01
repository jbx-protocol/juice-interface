import { Deploy } from "../generated/Juicer/Juicer";
import { SetHandle } from "../generated/Projects/Projects";
import { Project } from "../generated/schema";

export function handleDeploy(event: Deploy): void {
  let project = new Project(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  project.handle = event.params.handle.toHexString();
  project.owner = event.params.owner;
  project.createdAt = event.block.timestamp;
  project.uri = event.params.uri;
  project.save();
}

export function handleSetHandle(event: SetHandle): void {
  let project = Project.load(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  project.handle = event.params.handle.toHexString();
  project.save();
}
