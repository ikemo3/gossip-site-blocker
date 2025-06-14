#!/usr/bin/env tsx

/**
 * Script to fetch and process Google image search results HTML samples
 */

import { writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import { join } from "path";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

async function fetchGoogleImageSearch(query: string): Promise<string> {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&udm=2`;

  console.log(`Fetching: ${url}`);

  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.text();
}

function processHTML(html: string): string {
  console.log(`Original size: ${html.length} characters`);

  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Remove script tags to reduce file size and avoid security issues
  const scripts = document.querySelectorAll("script");
  scripts.forEach((script: Element) => {
    script.remove();
  });

  // Replace data: URL images with SVG placeholder
  const images = document.querySelectorAll("img[src^='data:image/']");
  images.forEach((img: Element) => {
    const width = img.getAttribute("width");
    const height = img.getAttribute("height");

    if (!width) {
      console.warn("Warning: img element missing width attribute");
    }
    if (!height) {
      console.warn("Warning: img element missing height attribute");
    }

    const widthValue = width || "100";
    const heightValue = height || "100";

    // Create SVG placeholder with dimensions
    const svgPlaceholder = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${widthValue}" height="${heightValue}" viewBox="0 0 ${widthValue} ${heightValue}"><rect width="100%" height="100%" fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="12" fill="%23999">${widthValue}x${heightValue}</text></svg>`;

    img.setAttribute("src", svgPlaceholder);
    // Also remove the data-deferred attribute which may contain base64 data
    img.removeAttribute("data-deferred");
  });

  const processed = dom.serialize();
  console.log(`Processed size: ${processed.length} characters`);
  console.log(
    `Size reduction: ${(((html.length - processed.length) / html.length) * 100).toFixed(1)}%`,
  );

  return processed;
}

async function main() {
  // Using Hatsune Miku as search query - she's so amazing! 💚
  const query = "初音ミク";
  const outputDir = join(process.cwd(), "test", "fixtures");
  const outputFile = join(outputDir, "google-image-search-hatsune-miku.html");

  try {
    // Fetch HTML
    const html = await fetchGoogleImageSearch(query);

    // Process HTML
    const processed = processHTML(html);

    // Save to file
    writeFileSync(outputFile, processed, "utf8");
    console.log(`Saved to: ${outputFile}`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Execute main function if this is the entry point
main();
