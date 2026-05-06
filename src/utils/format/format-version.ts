export function formatVersion(version: string): string {
  return version.startsWith("v") ? version : `v${version}`;
}
