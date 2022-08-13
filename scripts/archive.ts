import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { execSync } from "child_process";
import { zip } from "zip-a-folder";

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

function getExtensionId(projectDir: string) {
    const extensionIdPath = projectDir + "/apps/.web-extension-id";
    const webExtensionId = readFileSync(extensionIdPath).toString();
    return webExtensionId.split("\n")[2];
}

async function createChromeExtension(packageName: string, projectDir: string) {
    console.log(`Create ${packageName}.zip`);
    await zip(projectDir + "/dist-chrome", projectDir + `/tmp/workspace/${packageName}-chrome.zip`);
}

async function createFirefoxExtension(packageName: string, projectDir: string) {
    // load manifest.json
    const extensionId = getExtensionId(projectDir);
    console.log(`Extension ID: ${extensionId}`);

    const manifestJsonPath = projectDir + "/apps/manifest.json";
    const manifestJson = JSON.parse(readFileSync(manifestJsonPath).toString());
    manifestJson.browser_specific_settings = { gecko: { id: extensionId } };

    // write manifest.json
    const manifestJsonWritePath = projectDir + "/dist-firefox/manifest.json";
    writeFileSync(manifestJsonWritePath, JSON.stringify(manifestJson, null, 2));

    // create Firefox extension(xpi)
    await zip(projectDir + "/dist-firefox", projectDir + `/tmp/workspace/${packageName}-firefox.xpi`);
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
    cpSync(projectDir + "/dist", projectDir + "/dist-chrome", { recursive: true });
    cpSync(projectDir + "/dist", projectDir + "/dist-firefox", { recursive: true });
    copyFileSync(projectDir + "/apps/.web-extension-id", projectDir + "/dist-firefox/.web-extension-id");

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
