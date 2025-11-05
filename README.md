# Big File Generator

> A fast, memory-efficient utility for generating large test files of any size and type.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2012.0.0-brightgreen.svg)](https://nodejs.org)

Perfect for testing file uploads, transfer speeds, storage systems, and bandwidth limits without having to download actual large files.

## Features

- ✨ **Zero Dependencies** - Pure Node.js, no npm packages required
- 🚀 **Memory Efficient** - Generates files of any size using streaming (1MB chunks)
- ⚡ **Fast Generation** - Uses optimized pattern generation instead of random data
- 📊 **Real-time Progress** - Live progress updates with percentage and MB written
- 🎯 **Multiple File Types** - Built-in presets for common file extensions
- 🔧 **Customizable** - Full control over size, type, and filename
- 🔄 **No Duplicates** - Automatic random suffixes prevent filename conflicts
- 💻 **Cross-Platform** - Works on Windows, macOS, and Linux

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/big-file-generator.git
cd big-file-generator

# Generate a 10GB file (default)
node generate.js

# Generate a 5GB video file
node generate.js --size 5 --type mp4
```

## Installation

### Option 1: Clone and Run
```bash
git clone https://github.com/yourusername/big-file-generator.git
cd big-file-generator
node generate.js --help
```

### Option 2: Download Single File
Just download `generate.js` and run it directly:
```bash
node generate.js
```

## Usage

### Basic Examples

```bash
# Generate 10GB file with default .bin extension
node generate.js
# Output: files/test-file-a3x9k2p1.bin (random suffix prevents duplicates)

# Generate 5GB video file
node generate.js --size 5 --type mp4
# Output: files/test-file-m8n4j7q2.mp4

# Generate 1GB PDF
node generate.js --size 1 --type pdf
# Output: files/test-file-b5w8x1y9.pdf

# Generate 100MB test file
node generate.js --size 0.1 --type zip
# Output: files/test-file-k7m3n2p9.zip

# Custom filename (random suffix still added)
node generate.js --size 2 --name my-upload-test.dat
# Output: files/my-upload-test-c6d9e2f5.dat
```

**Note:** All generated files are automatically stored in the `files/` directory, which is created automatically if it doesn't exist.

### Using NPM Scripts

```bash
# Run with default settings
npm run generate

# Pass custom options (note the -- separator)
npm run generate -- --size 5 --type mp4
npm run generate -- --size 2 --name test.bin
```

### Advanced Examples

```bash
# Test various file sizes
node generate.js --size 0.01 --type jpg    # 10MB image
node generate.js --size 0.5 --type pdf     # 500MB PDF
node generate.js --size 10 --type mp4      # 10GB video
node generate.js --size 50 --type iso      # 50GB disk image

# Custom extensions
node generate.js --size 2 --type avi       # Any extension works
node generate.js --size 1 --type docx      # Even proprietary formats
```

## Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--size <GB>` | | File size in gigabytes | `10` |
| `--type <type>` | `--ext` | File type/extension | `bin` |
| `--name <name>` | | Custom filename (overrides `--type`) | `test-file.<ext>` |
| `--help` | `-h` | Show help message | - |

## Supported File Types

The generator includes presets for common file types:

| Type | Extension | Description |
|------|-----------|-------------|
| `bin` | `.bin` | Binary file (default) |
| `txt` | `.txt` | Text file |
| `dat` | `.dat` | Data file |
| `mp4` | `.mp4` | Video file |
| `zip` | `.zip` | Archive file |
| `pdf` | `.pdf` | PDF document |
| `jpg` | `.jpg` | JPEG image |
| `png` | `.png` | PNG image |
| `iso` | `.iso` | Disk image |
| `csv` | `.csv` | CSV file |
| `json` | `.json` | JSON file |
| `xml` | `.xml` | XML file |

**Note:** You can use any custom extension by specifying it with `--type`. The generator doesn't validate file types - it simply creates files with the specified extension.

## How It Works

The generator creates files efficiently using Node.js streams:

1. **Streaming Write** - Uses `fs.createWriteStream()` to write data incrementally
2. **Fixed Chunks** - Writes 1MB chunks at a time to minimize memory usage
3. **Pattern Data** - Fills chunks with a simple repeating pattern (0-255) for speed
4. **Backpressure Handling** - Respects stream backpressure to prevent memory overflow
5. **Random Suffixes** - Automatically adds 8-character random suffix to prevent filename conflicts

This approach allows generating files of any size (even 100GB+) while using minimal RAM.

### File Organization

**Files Directory:**
All generated files are automatically stored in the `files/` directory in your project root. The directory is created automatically on first run if it doesn't exist.

**Random Filename Suffixes:**
Every generated file automatically receives a unique 8-character random suffix (e.g., `a3x9k2p1`). This means you can:
- Generate multiple test files without worrying about overwriting
- Run the same command repeatedly for batch file generation
- Never need to manually specify unique filenames
- Keep your project root clean with all test files organized in one place

## Use Cases

- 📤 **Upload Testing** - Test file upload functionality in web applications
- 🌐 **Bandwidth Testing** - Measure network transfer speeds
- 💾 **Storage Testing** - Test disk space, quotas, and filesystem limits
- 🔄 **Backup Testing** - Validate backup and restore procedures
- 📦 **Compression Testing** - Test compression algorithms and tools
- 🎬 **Media Pipeline Testing** - Simulate large video/image processing
- ☁️ **Cloud Storage Testing** - Test S3, Azure Blob, or other cloud storage

## Performance

Generation speed depends on your disk write speed:

- **SSD**: ~500-1000 MB/s (10GB in 10-20 seconds)
- **HDD**: ~100-200 MB/s (10GB in 50-100 seconds)
- **Network Drive**: Varies based on connection

Memory usage remains constant (~10-20MB) regardless of file size.

## Cleanup

Remove generated test files when done:

```bash
# Windows PowerShell
Remove-Item files\* -Recurse

# macOS/Linux
rm -rf files/*

# Remove specific file
rm files/test-file-a3x9k2p1.mp4

# Remove entire files directory
rmdir files  # Windows
rm -rf files  # macOS/Linux
```

## Troubleshooting

### Insufficient Disk Space
Ensure you have enough free disk space before generating large files:
```bash
# Check free space (Windows PowerShell)
Get-PSDrive C

# Check free space (macOS/Linux)
df -h .
```

### Slow Generation
- Check disk write speed - use SSD for faster generation
- Close other disk-intensive applications
- Ensure antivirus isn't scanning files during creation

### Permission Errors
- Ensure you have write permissions in the current directory
- On Unix systems, check with: `ls -la`

## Requirements

- **Node.js** >= 12.0.0 (LTS recommended)
- No additional npm packages required

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contributions

- Add random data generation option
- Add multiple file generation
- Add progress bar with ETA
- Add verification/checksum options
- Add config file support
- Improve error handling

```

## Acknowledgments

- Created by **New Horizon Code PTY LTD**
- Built with Node.js
- Inspired by the need for simple, efficient test file generation
- Thanks to all contributors!

## Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/big-file-generator/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/big-file-generator/discussions)
- ⭐ **Star this repo** if you find it useful!

---

Made with ❤️ for developers who need to test with big files

