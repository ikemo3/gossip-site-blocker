import { execSync, spawnSync } from "child_process";
import { readFileSync, renameSync } from "fs";
import path from "path";
import { isError, configureGhrOption } from "./libs.js";
import { fileURLToPath } from "url";

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getGitSha() {
  const sha = execSync("git rev-parse HEAD");
  return sha.toString().trim();
}

function getManifestVersion(projectDir: string) {
  const manifestJsonPath = projectDir + "/apps/manifest.json";
  const manifestJson = JSON.parse(readFileSync(manifestJsonPath).toString());
  return manifestJson.version;
}

function getManifestVersionName(projectDir: string) {
  const manifestJsonPath = projectDir + "/apps/manifest.json";
  const manifestJson = JSON.parse(readFileSync(manifestJsonPath).toString());
  return manifestJson.version_name;
}

function getPackageVersion(projectDir: string) {
  const packageJsonPath = projectDir + "/package.json";
  const packageJson = JSON.parse(readFileSync(packageJsonPath).toString());
  return packageJson.version;
}

function getPackageName(projectDir: string) {
  const packageJsonPath = projectDir + "/package.json";
  const packageJson = JSON.parse(readFileSync(packageJsonPath).toString());
  return packageJson.name;
}

function main() {
  const projectDir = path.dirname(__dirname);

  const branch = process.env.CIRCLE_BRANCH;
  const tag = process.env.CIRCLE_TAG;
  const packageVersion = getPackageVersion(projectDir);
  const manifestVersion = getManifestVersion(projectDir);
  const manifestVersionName = getManifestVersionName(projectDir);

  const config = configureGhrOption(
    branch,
    tag,
    manifestVersion,
    manifestVersionName,
    packageVersion,
  );
  if (isError(config)) {
    console.log(config.message);
    process.exit(config.exitCode);
  }

  const packageName = getPackageName(projectDir);

  renameSync(
    `tmp/workspace/${packageName}-chrome.zip`,
    `tmp/workspace/${packageName}-${config.name}-chrome.zip`,
  );
  renameSync(
    `tmp/workspace/${packageName}-firefox.xpi`,
    `tmp/workspace/${packageName}-${config.name}-firefox.xpi`,
  );

  const args = [
    "-c",
    getGitSha(),
    "-n",
    config.name,
    ...config.ghrOptions,
    config.tag,
    "tmp/workspace/",
  ];
  console.log("ghr", args);
  spawnSync("ghr", args);
}

main();
