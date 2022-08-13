import path from "path";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "fs";
import { format } from "date-fns";

// Create if there is no dist directory
const projectDir = path.dirname(__dirname);
const distDir = projectDir + "/dist";
const manifestJsonPath = projectDir + "/apps/manifest.json";

if (!existsSync(distDir)) {
    mkdirSync(distDir);
}

// Load manifest.json
const manifest = JSON.parse(readFileSync(manifestJsonPath).toString());

// set version_name
const branch = process.env.CIRCLE_BRANCH;
if (branch) {
    const version = manifest.version;
    const now = format(new Date(), "yyyyMMdd-HHmm");
    manifest.version_name = `${version}-snapshot(${now})`;
}

const manifestWriteJsonPath = distDir + "/manifest.json";
writeFileSync(manifestWriteJsonPath, JSON.stringify(manifest, null, 2));
