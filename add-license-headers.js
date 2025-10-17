import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIT_HEADER_JS_TS = `/**
 * @license
 * Copyright (c) 2025 Daniele Rodrigues dos Santos
 * MIT License
 */

`;

const MIT_HEADER_CSS = `/*!
 * @license
 * Copyright (c) 2025 Daniele Rodrigues dos Santos
 * MIT License
 */

`;

const MIT_HEADER_HTML = `<!--
  @license
  Copyright (c) 2025 Daniele Rodrigues dos Santos
  MIT License
-->
`;

const FILE_PATTERNS = [
  { pattern: /\.[jt]sx?$/, header: MIT_HEADER_JS_TS },
  { pattern: /\.(css|scss)$/, header: MIT_HEADER_CSS },
  { pattern: /\.html$/, header: MIT_HEADER_HTML },
];

const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build'];
const IGNORE_FILES = ['package-lock.json', 'pnpm-lock.yaml', 'bun.lockb'];

function shouldIgnoreFile(filePath) {
  return IGNORE_DIRS.some(dir => filePath.includes(`/${dir}/`)) ||
         IGNORE_FILES.includes(path.basename(filePath));
}

function hasLicenseHeader(content) {
  return content.includes('@license') || 
         content.includes('MIT License') ||
         content.includes('Copyright (c)');
}

function processFile(filePath) {
  if (shouldIgnoreFile(filePath)) {
    console.log(`Skipping ignored file: ${filePath}`);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const pattern = FILE_PATTERNS.find(p => p.pattern.test(ext));
  
  if (!pattern) {
    console.log(`No header pattern for file: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  if (hasLicenseHeader(content)) {
    console.log(`License header already exists in: ${filePath}`);
    return;
  }

  // Special handling for HTML files to keep DOCTYPE at the top
  if (ext === '.html') {
    const doctypeMatch = content.match(/^<\!DOCTYPE[^>]*>/i);
    if (doctypeMatch) {
      content = content.replace(
        doctypeMatch[0],
        `${doctypeMatch[0]}\n${pattern.header}`
      );
    } else {
      content = pattern.header + content;
    }
  } else {
    // Add shebang back if it exists
    const shebangMatch = content.match(/^#!.*\n/);
    if (shebangMatch) {
      content = content.replace(
        shebangMatch[0],
        `${shebangMatch[0]}${pattern.header}`
      );
    } else {
      content = pattern.header + content;
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Added license header to: ${filePath}`);
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile()) {
      try {
        processFile(fullPath);
      } catch (error) {
        console.error(`Error processing ${fullPath}:`, error.message);
      }
    }
  });
}

// Start processing from the current directory
console.log('Adding license headers to files in:', __dirname);
processDirectory(__dirname);
console.log('License header addition complete!');