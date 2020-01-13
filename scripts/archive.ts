import { writeFileSync } from 'fs';
import dayjs from 'dayjs';
import { join } from 'path';
import { execFileSync, execSync } from 'child_process';
import {
    getManifest,
    getPackageName,
    getWebExtensionId,
    mkdirIfNeeded,
    writeManifest,
} from './libs';

const now = dayjs().format('YYYYMMDD-HHmm');
const projectTop = join(__dirname, '..');
const distDir = join(projectTop, 'dist');
const packageName = getPackageName();
const branch = process.env.CIRCLE_BRANCH;
const tag = process.env.CIRCLE_TAG;
const pem_base64 = process.env.PEM_BASE64;

// create Chrome Extension
// rewrite manifest.json
mkdirIfNeeded(distDir);
if (branch && branch !== '') {
    console.info('add `version_name` to manifest.json');
    const manifest = getManifest();
    manifest.version_name = `${manifest.version}-snapshot(${now})`;
    writeManifest(manifest);
} else if (tag && tag.endsWith('spike')) {
    console.info('add `version_name` to manifest.json');
    const manifest = getManifest();
    manifest.version_name = `${manifest.version}-${tag}(${now})`;
    writeManifest(manifest);
}

mkdirIfNeeded(join(projectTop, 'tmp'));
mkdirIfNeeded(join(projectTop, 'tmp', 'workspace'));

if (pem_base64 !== undefined) {
    // decode private key
    const buffer = Buffer.from(pem_base64, 'base64');
    const pem = buffer.toString();
    const pemPath = join(projectTop, 'tmp', `${packageName}.pem`);
    writeFileSync(pemPath, pem);

    // create Chrome Extension(signed)
    console.info(`Create ${packageName}.crx with private key`);
    execFileSync('yarn', ['crx', 'pack', '-o', `tmp/workspace/${packageName}.crx`, 'dist', '-p', `tmp/${packageName}.pem`]);
} else {
    // create Chrome Extension(signed, create private key)
    console.info(`Create ${packageName}.crx`);
    execFileSync('yarn', ['crx', 'pack', '-o', `tmp/workspace/${packageName}.crx`, 'dist']);
}

// create Chrome Extension(unsigned)
console.info(`Create ${packageName}.zip`);
execFileSync('yarn', ['crx', 'pack', '--zip-output', `tmp/workspace/${packageName}.zip`, 'dist']);

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
