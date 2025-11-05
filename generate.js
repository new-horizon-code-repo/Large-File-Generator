#!/usr/bin/env node

/**
 * Big File Generator
 * A fast, memory-efficient utility for generating large test files
 * 
 * @author New Horizon Code PTY LTD
 * @license MIT
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

// Configuration constants
const DEFAULT_SIZE_GB = 10;
const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
const MAX_SIZE_GB = 1000; // Safety limit: 1TB
const MIN_SIZE_GB = 0.001; // Minimum: 1MB

// Windows reserved filenames
const WINDOWS_RESERVED = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 
  'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 
  'LPT8', 'LPT9'];

// File type presets
const FILE_TYPES = {
  bin: { ext: '.bin', desc: 'Binary file' },
  txt: { ext: '.txt', desc: 'Text file' },
  dat: { ext: '.dat', desc: 'Data file' },
  mp4: { ext: '.mp4', desc: 'Video file' },
  zip: { ext: '.zip', desc: 'Archive file' },
  pdf: { ext: '.pdf', desc: 'PDF document' },
  jpg: { ext: '.jpg', desc: 'Image file' },
  png: { ext: '.png', desc: 'Image file' },
  iso: { ext: '.iso', desc: 'Disk image' },
  csv: { ext: '.csv', desc: 'CSV file' },
  json: { ext: '.json', desc: 'JSON file' },
  xml: { ext: '.xml', desc: 'XML file' }
};

/**
 * Validates the file size
 * @param {number} size - Size in GB
 * @returns {Object} - {valid: boolean, error: string}
 */
function validateSize(size) {
  if (isNaN(size)) {
    return { valid: false, error: 'Size must be a valid number' };
  }
  if (size <= 0) {
    return { valid: false, error: 'Size must be greater than 0' };
  }
  if (size < MIN_SIZE_GB) {
    return { valid: false, error: `Size must be at least ${MIN_SIZE_GB} GB (1 MB)` };
  }
  if (size > MAX_SIZE_GB) {
    return { valid: false, error: `Size cannot exceed ${MAX_SIZE_GB} GB (1 TB) for safety` };
  }
  return { valid: true };
}

/**
 * Validates and sanitizes filename
 * @param {string} name - Filename to validate
 * @returns {Object} - {valid: boolean, error: string}
 */
function validateFilename(name) {
  // Check for null or empty
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Filename cannot be empty' };
  }

  // Get just the filename without path
  const basename = path.basename(name);
  
  // Check for path traversal attempts
  if (name.includes('..') || name !== basename) {
    return { valid: false, error: 'Filename cannot contain path traversal sequences' };
  }

  // Check for invalid characters (different per OS)
  const invalidChars = process.platform === 'win32' 
    ? /[<>:"|?*\x00-\x1f]/
    : /[\x00]/;
  
  if (invalidChars.test(name)) {
    return { valid: false, error: 'Filename contains invalid characters' };
  }

  // Check Windows reserved names
  if (process.platform === 'win32') {
    const nameWithoutExt = basename.split('.')[0].toUpperCase();
    if (WINDOWS_RESERVED.includes(nameWithoutExt)) {
      return { valid: false, error: `"${nameWithoutExt}" is a reserved filename on Windows` };
    }
  }

  // Check length
  if (basename.length > 255) {
    return { valid: false, error: 'Filename is too long (max 255 characters)' };
  }

  return { valid: true };
}

/**
 * Checks if there's enough disk space
 * @param {string} targetPath - Path where file will be created
 * @param {number} requiredBytes - Required space in bytes
 * @returns {Promise<Object>} - {sufficient: boolean, error: string}
 */
async function checkDiskSpace(targetPath, requiredBytes) {
  try {
    // This is a basic check - doesn't work on all systems
    // But it's better than nothing
    const stats = fs.statSync(path.dirname(targetPath));
    // We can't reliably check disk space in pure Node.js without external modules
    // So we'll just check if the directory is writable
    try {
      fs.accessSync(path.dirname(targetPath), fs.constants.W_OK);
      return { sufficient: true };
    } catch (err) {
      return { sufficient: false, error: 'Directory is not writable' };
    }
  } catch (err) {
    return { sufficient: false, error: `Cannot access directory: ${err.message}` };
  }
}

/**
 * Exits gracefully with error message
 * @param {string} message - Error message
 * @param {number} code - Exit code (default: 1)
 */
function exitWithError(message, code = 1) {
  console.error(`\n✗ Error: ${message}\n`);
  process.exit(code);
}

/**
 * Generates a random alphanumeric string
 * @param {number} length - Length of string to generate
 * @returns {string} - Random string
 */
function generateRandomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Parse command line arguments
const args = process.argv.slice(2);
let sizeInGB = DEFAULT_SIZE_GB;
let filename = null;
let fileType = 'bin';

// Simple argument parsing
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--size' && args[i + 1]) {
    sizeInGB = parseFloat(args[i + 1]);
    i++;
  } else if (args[i] === '--name' && args[i + 1]) {
    filename = args[i + 1];
    i++;
  } else if ((args[i] === '--type' || args[i] === '--ext') && args[i + 1]) {
    fileType = args[i + 1].toLowerCase().replace('.', '');
    i++;
  } else if (args[i] === '--version' || args[i] === '-v') {
    console.log('Big File Generator v1.0.0');
    console.log('Copyright (c) 2025 New Horizon Code PTY LTD');
    process.exit(0);
  } else if (args[i] === '--help' || args[i] === '-h') {
    const typesList = Object.entries(FILE_TYPES)
      .map(([key, val]) => `    ${key.padEnd(8)} - ${val.desc}`)
      .join('\n');
    
    console.log(`
Big File Generator v1.0.0
A fast, memory-efficient utility for generating large test files

Usage: node generate.js [options]

Options:
  --size <GB>     Size of file in gigabytes (default: ${DEFAULT_SIZE_GB})
                  Range: ${MIN_SIZE_GB} GB to ${MAX_SIZE_GB} GB
  --type <type>   File type/extension (default: bin)
  --name <name>   Custom filename (a random suffix is automatically added)
  --version, -v   Show version information
  --help, -h      Show this help message

Available file types:
${typesList}

Examples:
  node generate.js
  # Output: test-file-a3x9k2p1.bin

  node generate.js --size 5 --type mp4
  # Output: files/test-file-m8n4j7q2.mp4

  node generate.js --size 10 --type pdf
  # Output: files/test-file-b5w8x1y9.pdf

  node generate.js --size 2 --name backup.zip
  # Output: files/backup-k7m3n2p9.zip

  npm run generate -- --size 1 --type jpg
  # Output: files/test-file-c6d9e2f5.jpg

Notes:
  - All files are stored in the 'files/' directory (created automatically)
  - A random 8-character suffix is automatically added to prevent file duplication
  - File generation can be interrupted with Ctrl+C (partial files will be cleaned up)
  - Ensure sufficient disk space before generating large files
  - Generated files contain a repeating pattern (not random data)
    `);
    process.exit(0);
  } else if (args[i].startsWith('--')) {
    exitWithError(`Unknown option: ${args[i]}\nUse --help for usage information`);
  }
}

// Validate size
const sizeValidation = validateSize(sizeInGB);
if (!sizeValidation.valid) {
  exitWithError(sizeValidation.error);
}

// Validate custom filename FIRST if provided
if (filename) {
  const inputValidation = validateFilename(filename);
  if (!inputValidation.valid) {
    exitWithError(inputValidation.error);
  }
}

// Set filename based on type if not explicitly provided
if (!filename) {
  const ext = FILE_TYPES[fileType] ? FILE_TYPES[fileType].ext : `.${fileType}`;
  const randomSuffix = generateRandomString(8);
  filename = `test-file-${randomSuffix}${ext}`;
} else {
  // If custom filename provided, add random suffix before extension
  // Use basename to strip any path components (security measure)
  const basename = path.basename(filename);
  const parsedPath = path.parse(basename);
  const randomSuffix = generateRandomString(8);
  filename = `${parsedPath.name}-${randomSuffix}${parsedPath.ext}`;
}

const totalBytes = Math.floor(sizeInGB * 1024 * 1024 * 1024);

// Create 'files' directory if it doesn't exist
const filesDir = path.join(__dirname, 'files');
if (!fs.existsSync(filesDir)) {
  try {
    fs.mkdirSync(filesDir, { recursive: true });
    console.log(`✓ Created directory: ${filesDir}\n`);
  } catch (err) {
    exitWithError(`Failed to create files directory: ${err.message}`);
  }
}

const outputPath = path.join(filesDir, filename);

console.log(`
╔════════════════════════════════════════╗
║   Large File Generator                 ║
╚════════════════════════════════════════╝

Configuration:
  • File Size: ${sizeInGB} GB (${totalBytes.toLocaleString()} bytes)
  • Filename: ${filename}
  • Chunk Size: ${(CHUNK_SIZE / 1024 / 1024).toFixed(2)} MB

Starting generation...
`);

// Create a buffer filled with random-ish data (for better compression testing, use random data)
// For faster generation, we'll use a repeated pattern
const chunk = Buffer.alloc(CHUNK_SIZE);
for (let i = 0; i < CHUNK_SIZE; i++) {
  // Simple pattern that creates some variety but is fast to generate
  chunk[i] = i % 256;
}

const writeStream = fs.createWriteStream(outputPath);
let bytesWritten = 0;
let lastProgress = 0;
let isGenerating = true;

/**
 * Cleanup function for graceful shutdown
 * @param {string} reason - Reason for cleanup
 */
function cleanup(reason = 'interrupted') {
  if (!isGenerating) return;
  
  isGenerating = false;
  console.log(`\n\n⚠ Generation ${reason}. Cleaning up...`);
  
  try {
    writeStream.destroy();
    
    // Remove partial file
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
      console.log(`✓ Partial file removed.`);
    }
  } catch (err) {
    console.error(`✗ Cleanup error: ${err.message}`);
  }
  
  process.exit(reason === 'interrupted' ? 130 : 1);
}

// Handle interruption signals
process.on('SIGINT', () => cleanup('interrupted'));
process.on('SIGTERM', () => cleanup('terminated'));

function writeChunk() {
  let canContinue = true;
  
  while (bytesWritten < totalBytes && canContinue) {
    const remainingBytes = totalBytes - bytesWritten;
    const bytesToWrite = Math.min(CHUNK_SIZE, remainingBytes);
    
    if (bytesToWrite < CHUNK_SIZE) {
      // Last chunk - write only remaining bytes
      canContinue = writeStream.write(chunk.slice(0, bytesToWrite));
      bytesWritten += bytesToWrite;
    } else {
      canContinue = writeStream.write(chunk);
      bytesWritten += CHUNK_SIZE;
    }
    
    // Update progress
    const progress = Math.floor((bytesWritten / totalBytes) * 100);
    if (progress > lastProgress) {
      lastProgress = progress;
      const mbWritten = (bytesWritten / 1024 / 1024).toFixed(2);
      const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
      process.stdout.write(`\rProgress: ${progress}% (${mbWritten} MB / ${totalMB} MB)`);
    }
  }
  
  if (bytesWritten >= totalBytes) {
    writeStream.end();
  }
}

writeStream.on('drain', () => {
  writeChunk();
});

writeStream.on('finish', () => {
  isGenerating = false;
  
  try {
    const stats = fs.statSync(outputPath);
    const actualSizeGB = (stats.size / 1024 / 1024 / 1024).toFixed(2);
    
    // Verify file size matches expected
    if (stats.size !== totalBytes) {
      console.warn(`\n⚠ Warning: File size (${stats.size}) doesn't match expected (${totalBytes})`);
    }
    
    console.log(`\n
✓ File generated successfully!

Details:
  • Location: ${outputPath}
  • Size: ${actualSizeGB} GB
  • Bytes: ${stats.size.toLocaleString()}
  
Ready for upload testing!
  `);
    process.exit(0);
  } catch (err) {
    exitWithError(`Failed to verify file: ${err.message}`);
  }
});

writeStream.on('error', (err) => {
  isGenerating = false;
  
  // Provide more specific error messages
  let errorMsg = err.message;
  if (err.code === 'ENOSPC') {
    errorMsg = 'Not enough disk space available';
  } else if (err.code === 'EACCES' || err.code === 'EPERM') {
    errorMsg = 'Permission denied - cannot write to this location';
  } else if (err.code === 'ENOENT') {
    errorMsg = 'Directory does not exist';
  }
  
  // Try to cleanup
  try {
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  } catch (cleanupErr) {
    // Ignore cleanup errors
  }
  
  exitWithError(`File generation failed: ${errorMsg}`);
});

// Start writing
writeChunk();

