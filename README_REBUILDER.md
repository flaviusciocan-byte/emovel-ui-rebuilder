# Emovel UI Rebuilder - Capture Pipeline

## Overview

Complete web page capture and analysis pipeline for extracting UI components and structure from live URLs.

## Features

- **Screenshot Capture**: Full-page PNG screenshots at 1440x1200 viewport
- **HTML Extraction**: Complete HTML content extraction and storage
- **Metadata Extraction**: Structured metadata including headings, links, images
- **Automatic Directory Management**: Creates required directories automatically

## Directory Structure

```
public/captures/          # Screenshot PNG files
research/html/            # Extracted HTML files
research/metadata/        # Extracted metadata JSON files
_reference/               # Reference files (gitignored)
src/rebuilder/
  ├── capture/
  │   ├── capturePage.ts     # Screenshot capture
  │   ├── extractHTML.ts     # HTML extraction
  │   ├── extractMetadata.ts # Metadata extraction
  │   └── index.ts           # Orchestrator (captureAndAnalyze)
  └── utils/
      └── ensureDirs.ts      # Directory management
```

## Usage

### Using the Full Pipeline (Recommended)

```typescript
import { captureAndAnalyze } from "./src/rebuilder/capture";

const result = await captureAndAnalyze("https://example.com");
// Returns:
// {
//   url: "https://example.com",
//   status: "success",
//   screenshot: { path, capturedAt },
//   html: { path, extractedAt },
//   metadata: { path, title, description, headingsCount, linksCount, imagesCount, extractedAt }
// }
```

### Using Individual Functions

```typescript
import { capturePage } from "./src/rebuilder/capture";
import { extractHTML } from "./src/rebuilder/capture";
import { extractMetadata } from "./src/rebuilder/capture";
import { ensureDirectories } from "./src/rebuilder/utils/ensureDirs";

await ensureDirectories();

// Capture screenshot
const screenshot = await capturePage("https://example.com");

// Extract HTML
const html = await extractHTML("https://example.com");

// Extract metadata
const metadata = await extractMetadata("https://example.com");
```

### CLI Scripts

Test individual capture operations:

```bash
# Capture screenshot only
node scripts/test-capture.mjs https://example.com

# Capture screenshot + extract HTML
node scripts/test-extract.mjs https://example.com

# Extract metadata only
node scripts/test-metadata.mjs https://example.com

# Full pipeline (uses main script)
node scripts/rebuild-url.mjs https://example.com
```

## Extracted Metadata

Each captured page includes:

- **title**: Page title
- **description**: Meta description or OG description
- **headings**: All h1, h2, h3 elements with text content
- **links**: Up to 50 links with text and href
- **images**: Up to 50 images with alt text and src

## Output Examples

### Screenshot
- `public/captures/capture-1717600000000.png`

### HTML
- `research/html/page-1717600000000.html`

### Metadata
- `research/metadata/metadata-1717600000000.json`

```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "description": "Example Domain. This domain is for use in examples...",
  "headings": [
    { "tag": "h1", "text": "Example Domain" },
    { "tag": "p", "text": "..." }
  ],
  "links": [
    { "text": "More information...", "href": "https://www.iana.org/domains/example" }
  ],
  "images": [],
  "capturedAt": "2024-06-05T12:36:21.000Z"
}
```

## Error Handling

The pipeline includes comprehensive error handling:

```typescript
const result = await captureAndAnalyze("https://invalid-url");
// Returns:
// {
//   url: "https://invalid-url",
//   status: "error",
//   error: "Error message describing what went wrong"
// }
```

## Browser Configuration

- **Viewport**: 1440x1200 (desktop resolution)
- **Wait Policy**: `networkidle` (waits for network to be idle)
- **Full Page**: Screenshots capture entire scrollable height
- **Browser**: Chromium (via Playwright)

## Performance Notes

- All capture operations for a single URL run in parallel
- Screenshot capture typically takes 2-5 seconds
- HTML extraction typically takes 1-3 seconds
- Metadata extraction typically takes 1-2 seconds

## Dependencies

- `playwright`: Browser automation
- `node:fs/promises`: File system operations

## Future Enhancements

- [ ] CSS extraction and analysis
- [ ] JavaScript bundle analysis
- [ ] Performance metrics collection
- [ ] Accessibility audit (WCAG compliance)
- [ ] Component detection and classification
- [ ] Batch processing with progress tracking
