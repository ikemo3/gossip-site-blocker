import { execSync } from "child_process";
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
} from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { zip } from "zip-a-folder";

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

async function createChromeExtension(
  packageName: string,
  projectDir: string,
  suffix: string,
) {
  // Output file name is determined by suffix (e.g. -v1.16.0 or -snapshot)
  const fileName = `${packageName}-${suffix}-chrome.zip`;
  console.log(`Create ${fileName}`);
  await zip(
    projectDir + "/dist-chrome",
    projectDir + `/tmp/workspace/${fileName}`,
  );
}

async function createFirefoxExtension(
  packageName: string,
  projectDir: string,
  suffix: string,
) {
  // Output file name is determined by suffix (e.g. -v1.16.0 or -snapshot)
  const fileName = `${packageName}-${suffix}-firefox.xpi`;
  console.log(`Create ${fileName}`);
  await zip(
    projectDir + "/dist-firefox",
    projectDir + `/tmp/workspace/${fileName}`,
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
  execSync("pnpm build", { stdio: "inherit" });
  cpSync(projectDir + "/dist", projectDir + "/dist-chrome", {
    recursive: true,
  });
  cpSync(projectDir + "/dist", projectDir + "/dist-firefox", {
    recursive: true,
  });
  copyFileSync(
    projectDir + "/public/.web-extension-id",
    projectDir + "/dist-firefox/.web-extension-id",
  );
  rmSync(projectDir + "/dist-chrome/manifest.firefox.json");
  renameSync(
    projectDir + "/dist-firefox/manifest.firefox.json",
    projectDir + "/dist-firefox/manifest.json",
  );

  // load package.json
  const packageName = getPackageName(projectDir);

  // Determine suffix for file name
  // Use environment variable RELEASE_TAG if set, otherwise use 'snapshot'
  const tag = process.env.RELEASE_TAG;
  const suffix = tag ? tag : "snapshot";

  // Create Chrome extension
  await createChromeExtension(packageName, projectDir, suffix);

  // Create Firefox extension
  await createFirefoxExtension(packageName, projectDir, suffix);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
