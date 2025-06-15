# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gossip Site Blocker is a Chrome extension that blocks harmful sites from Google search results. Built with TypeScript + Vite, it's developed as a WebExtension supporting both Chrome and Firefox.

**IMPORTANT: This is an English-only codebase. All code, comments, and documentation should be written in English.**

## Development Commands

### Basic Commands

```bash
pnpm install        # Install dependencies
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm test          # Run tests
pnpm lint          # Run linting
pnpm format        # Format code
pnpm fix           # Auto-fix ESLint issues
pnpm archive       # Create release archive
make ci            # Run full CI pipeline
```

### Testing

```bash
pnpm test                    # Run all tests
pnpm test -- --watch        # Watch mode
pnpm test -- test/block/     # Test specific directory
```

**Development Approach**: This project uses Test-Driven Development (TDD). Follow the Red-Green-Refactor cycle:

1. **Red**: Write a failing test first
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve code while keeping tests green

### Development Testing

For browser testing of the extension:

1. Build the extension: `pnpm build` (creates `dist/` directory)
2. Load the extension in Chrome:
   - Open Chrome Extensions (chrome://extensions/)
   - Enable "Developer mode"
   - Click "Load unpacked" and select `dist/` directory

**Note**: Always rebuild after code changes to test in browser. Firefox testing requires `pnpm archive` to create `dist-firefox/` directory.

## Architecture

### Directory Structure

- `apps/block/` - Block functionality detection and processing logic
- `apps/content_script/` - In-page UI element manipulation
- `apps/entry/` - Various entry points
- `apps/libs/` - Shared libraries and utilities
- `apps/model/` - Data model definitions
- `apps/page/` - Settings page UI
- `apps/storage/` - Chrome extension storage management
- `apps/values/` - Value objects and constants

### Manifest Management

- Chrome: `public/manifest.json` (Manifest V3)
- Firefox: `public/manifest.firefox.json` (Manifest V2)
- Dynamic generation: `scripts/make_manifest.ts` handles version management

### Build Output

- Chrome: `dist-chrome/`
- Firefox: `dist-firefox/`
- Packages: Archives generated in `tmp/workspace/`

## Code Quality

### Formatting & Linting

Always run before development:

```bash
pnpm format  # Prettier + sort-package-json
pnpm lint    # ESLint + TypeScript + dependency checks
```

### CI/CD

`make ci` executes:

1. Version consistency check
2. Install dependencies
3. lint, test, build, archive

## Technical Specifications

- **Package Manager**: pnpm
- **Build Tool**: Vite
- **Testing**: Vitest + jsdom
- **Quality Control**: ESLint + Prettier + dependency-cruiser + Renovate

## Development Notes

- Manifest file versions are automatically synced with package.json
- Support both Chrome/Firefox - be mindful of WebExtensions API compatibility
- Block functionality should be self-contained within `apps/block/`
- **IMPORTANT**: Do not directly access files in `test/fixtures/` directory due to large file sizes. Only access when explicitly requested by the user.

## Image Blocking Functionality

### Key Components

- `apps/block/google_image_tab.ts` - Main image blocking logic for Google image search
- `apps/block/detector.ts` - Controls image blocking based on user settings
- `apps/storage/options.ts` - Manages `blockGoogleImagesTab` setting (default: enabled)
- `apps/values/document_url.ts` - Detects Google image search pages

### Test Structure

- Tests located in `/test/` directory using Vitest framework
- Test files follow `*.test.ts` naming pattern
- Currently focused on unit tests for library functions
- No existing tests for HTML fixture-based blocking functionality

## Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Use the following format:

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Common Types

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `ci`: CI/CD configuration changes
- `perf`: Performance improvements
- `build`: Build system changes

### Branch Naming

Branch names should follow the pattern: `<type>/<description>`

Examples:

- `feat/add-new-blocker`
- `fix/search-result-detection`
- `docs/update-readme`
- `chore/update-dependencies`

## Release Process

### Manual Release Testing

Before creating a release, manual testing is required to ensure functionality across browsers:

1. **Download Release Assets from Snapshot**:
   - Download latest Chrome extension (.zip file)
   - Download latest Firefox extension (.xpi file)

2. **Chrome Testing**:
   - Extract the .zip file
   - Open Chrome Extensions (chrome://extensions/)
   - Enable "Developer mode"
   - Click "Load unpacked" and select extracted directory
   - Perform basic functionality testing

3. **Firefox Testing**:
   - Open Firefox Developer Edition
   - Set `xpinstall.signatures.required` to `false` in about:config
   - Install the .xpi file
   - Perform basic functionality testing

4. **Basic Functionality Tests**:
   - Test Google search result blocking
   - Test Google image search blocking
   - Verify settings page functionality
   - Check console for errors

### Beta Release Process

For beta releases after manual testing (e.g., 1.16.1 → 1.16.1.1 for Chrome extension):

1. **Version Update**:
   - Update `package.json` version by appending `.1` to current release (e.g., 1.16.1.1)
   - This follows Chrome extension versioning convention, not semver
   - Manifest versions will be automatically synced

2. **Beta Release Creation**:
   - No tag creation required - release from snapshot
   - Download updated assets from snapshot after CI build completes
