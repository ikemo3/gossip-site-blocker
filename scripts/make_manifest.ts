import { format } from "date-fns";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create if there is no dist directory
const projectDir = path.dirname(__dirname);
const distDir = projectDir + "/dist";
const manifestJsonPath = projectDir + "/public/manifest.json";
const firefoxManifestJsonPath = projectDir + "/public/manifest.firefox.json";

if (!existsSync(distDir)) {
  mkdirSync(distDir);
}

// Load manifest.json
const manifest = JSON.parse(readFileSync(manifestJsonPath).toString());
const firefoxManifest = JSON.parse(
  readFileSync(firefoxManifestJsonPath).toString(),
);

// set version_name
const ref = process.env.GITHUB_REF;
if (ref && ref.startsWith("refs/heads/main")) {
  const version = manifest.version;
  const now = format(new Date(), "yyyyMMdd-HHmm");
  manifest.version_name = `${version}-snapshot(${now})`;
  manifest.name = "Gossip Site Blocker(beta)";
  firefoxManifest.version_name = `${version}-snapshot(${now})`;
  firefoxManifest.name = "Gossip Site Blocker(beta)";
}

const manifestWriteJsonPath = distDir + "/manifest.json";
writeFileSync(manifestWriteJsonPath, JSON.stringify(manifest, null, 2));

const firefoxManifestWriteJsonPath = distDir + "/manifest.firefox.json";
writeFileSync(
  firefoxManifestWriteJsonPath,
  JSON.stringify(firefoxManifest, null, 2),
);
