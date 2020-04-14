import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import dayjs from 'dayjs';

const projectTop = join(__dirname, '..');
const srcDir = join(__dirname, '..', 'apps');
const distDir = join(__dirname, '..', 'dist');

interface Gecko {
    id: string;
}

interface BrowserSpecificSettings {
    gecko: Gecko;
}

interface Manifest {
    version: string;
    version_name: string;
    browser_specific_settings: BrowserSpecificSettings;
}

export function mkdirIfNeeded(path: string): void {
    if (!existsSync(path)) {
        mkdirSync(path);
    }
}

export function getPackageName(): string {
    const packageJsonPath = join(projectTop, 'package.json');
    const packageObj = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageObj.name;
}

export function getPackageVersion(): string {
    const packageJsonPath = join(projectTop, 'package.json');
    const packageObj = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageObj.version;
}

export function getManifest(): Manifest {
    const manifestJsonPath = join(projectTop, 'apps', 'manifest.json');
    const manifestJson = readFileSync(manifestJsonPath, 'utf-8');
    return JSON.parse(manifestJson);
}

export function writeManifest(manifest: Manifest): void {
    const distManifestJsonPath = join(distDir, 'manifest.json');
    writeFileSync(distManifestJsonPath, JSON.stringify(manifest, null, 2));
}

export function getWebExtensionId(): string {
    const webExtensionIdPath = join(srcDir, '.web-extension-id');
    const contents = readFileSync(webExtensionIdPath, 'utf-8');
    const lines = contents.split('\n');
    return lines[lines.length - 2];
}

export function createManifest(): void {
    const now = dayjs().format('YYYYMMDD-HHmm');
    const branch = process.env.CIRCLE_BRANCH;
    const tag = process.env.CIRCLE_TAG;

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
    } else {
        console.info('copy manifest.json');
        const manifest = getManifest();
        writeManifest(manifest);
    }
}
