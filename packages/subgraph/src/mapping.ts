import { Create, SetHandle, SetUri } from "../generated/Projects/Projects";
import { Project } from "../generated/schema";

export function handleProjectCreate(event: Create): void {
  let project = new Project(event.params.projectId.toHexString());
  project.handle = event.params.handle.toHexString();
  project.owner = event.params.owner;
  project.createdAt = event.block.timestamp;
  project.uri = event.params.uri;
  project.save();
}

export function handleSetHandle(event: SetHandle): void {
  let project = Project.load(event.params.projectId.toHexString());
  project.handle = event.params.handle.toHexString();
  project.save();
}

export function handleSetUri(event: SetUri): void {
  let project = Project.load(event.params.projectId.toHexString());
  project.uri = event.params.uri;
  project.save();
}
