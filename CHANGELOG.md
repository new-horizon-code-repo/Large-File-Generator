# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-05

### Added
- Initial release
- Generate files of any size from 1MB to 1TB
- Support for multiple file types (bin, txt, dat, mp4, zip, pdf, jpg, png, iso, csv, json, xml)
- Custom filename support
- Automatic random 8-character suffix to prevent filename conflicts
- Organized file storage in dedicated `files/` directory
- Automatic directory creation
- Real-time progress indicator
- Input validation for size and filenames
- Path traversal protection
- Windows reserved filename detection
- Graceful interruption handling (Ctrl+C cleanup)
- Comprehensive error messages
- Cross-platform support (Windows, macOS, Linux)
- Zero dependencies
- Memory-efficient streaming (1MB chunks)
- Help and version commands
- JSDoc documentation
- MIT License
- Comprehensive README
- Contributing guidelines
- Issue templates
- Testing guide

### Security
- Input validation for all user inputs
- Protection against path traversal attacks
- Filename sanitization
- Size limits (1MB minimum, 1TB maximum)
- Windows reserved filename checking

## [Unreleased]

### Planned Features
- Random data generation option
- Multiple file generation at once
- Progress bar with ETA
- MD5/SHA checksum generation
- Configuration file support
- Resume interrupted generation
- Sparse file support
- Content type headers for specific file types
- NPM package publication
- Automated tests

