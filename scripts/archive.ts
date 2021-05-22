import { writeFileSync } from "fs";
import { join } from "path";
import { execFileSync, execSync } from "child_process";
import { createManifest, getManifest, getPackageName, getWebExtensionId, mkdirIfNeeded, writeManifest } from "./libs";
import { distDir, projectTop } from "./const";

const packageName = getPackageName();
const pemBase64 = process.env.PEM_BASE64;

// create manifest.json
createManifest();

// create Chrome Extension
mkdirIfNeeded(join(projectTop, "tmp"));
mkdirIfNeeded(join(projectTop, "tmp", "workspace"));

if (pemBase64 !== undefined) {
    // decode private key
    const buffer = Buffer.from(pemBase64, "base64");
    const pem = buffer.toString();
    const pemPath = join(projectTop, "tmp", `${packageName}.pem`);
    writeFileSync(pemPath, pem);

    // create Chrome Extension(signed)
    console.info(`Create ${packageName}.crx with private key`);
    execFileSync("yarn", [
        "crx",
        "pack",
        "-o",
        `tmp/workspace/${packageName}.crx`,
        "dist",
        "-p",
        `tmp/${packageName}.pem`,
    ]);
} else {
    // create Chrome Extension(signed, create private key)
    console.info(`Create ${packageName}.crx`);
    execFileSync("yarn", ["crx", "pack", "-o", `tmp/workspace/${packageName}.crx`, "dist"]);
}

// create Chrome Extension(unsigned)
console.info(`Create ${packageName}.zip`);
execFileSync("yarn", ["crx", "pack", "--zip-output", `tmp/workspace/${packageName}.zip`, "dist"]);

// create Firefox Extension
const manifest = getManifest();
const extensionId = getWebExtensionId();
manifest.browser_specific_settings = {
    gecko: {
        id: extensionId,
    },
};
console.info(`extension id: ${extensionId}`);
writeManifest(manifest);

// create *.xpi
console.info(`Create ${packageName}.xpi`);
execSync(`zip -r ../tmp/workspace/${packageName}.xpi *`, { cwd: distDir });
