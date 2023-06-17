import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  renameSync,
  readFileSync,
  rmSync,
} from "fs";
import path from "path";
import { execSync } from "child_process";
import { zip } from "zip-a-folder";
import { fileURLToPath } from "url";

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function clearDirectory(path: string) {
  if (existsSync(path)) {
    rmSync(path, { recursive: true });
  }
}

function getPackageName(projectDir: string) {
  const packageJsonPath = projectDir + "/package.json";
  const packageJson = JSON.parse(readFileSync(packageJsonPath).toString());
  return packageJson.name;
}

async function createChromeExtension(packageName: string, projectDir: string) {
  console.log(`Create ${packageName}.zip`);
  await zip(
    projectDir + "/dist-chrome",
    projectDir + `/tmp/workspace/${packageName}-chrome.zip`
  );
}

async function createFirefoxExtension(packageName: string, projectDir: string) {
  console.log(`Create ${packageName}.xpi`);
  await zip(
    projectDir + "/dist-firefox",
    projectDir + `/tmp/workspace/${packageName}-firefox.xpi`
  );
}

async function main() {
  // create if there is no dist directory
  const projectDir = path.dirname(__dirname);
  clearDirectory(projectDir + "/dist-chrome");
  clearDirectory(projectDir + "/dist-firefox");
  clearDirectory(projectDir + "/tmp");
  mkdirSync(projectDir + "/tmp");
  mkdirSync(projectDir + "/tmp/workspace");

  // copy resources
  execSync("webpack", { stdio: "inherit" });
  cpSync(projectDir + "/dist", projectDir + "/dist-chrome", {
    recursive: true,
  });
  cpSync(projectDir + "/dist", projectDir + "/dist-firefox", {
    recursive: true,
  });
  copyFileSync(
    projectDir + "/apps/.web-extension-id",
    projectDir + "/dist-firefox/.web-extension-id"
  );
  rmSync(projectDir + "/dist-chrome/manifest.firefox.json");
  renameSync(
    projectDir + "/dist-firefox/manifest.firefox.json",
    projectDir + "/dist-firefox/manifest.json"
  );

  // load package.json
  const packageName = getPackageName(projectDir);

  // create Chrome extension
  await createChromeExtension(packageName, projectDir);

  // create Firefox extension
  await createFirefoxExtension(packageName, projectDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
