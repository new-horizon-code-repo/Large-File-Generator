# Contributing to Big File Generator

First off, thank you for considering contributing to Big File Generator! It's people like you that make this tool better for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (command you ran, expected vs actual output)
- **Describe the behavior you observed** and explain what's wrong
- **Include your environment details**:
  - Node.js version (`node --version`)
  - Operating system and version
  - File size and type you were trying to generate

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful** to most users
- **List examples** of how the feature would be used

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code, test it thoroughly
3. Ensure your code follows the existing style
4. Write clear commit messages
5. Update documentation as needed
6. Submit your pull request!

## Development Process

### Setup

```bash
git clone https://github.com/yourusername/big-file-generator.git
cd big-file-generator
```

### Testing Your Changes

```bash
# Test basic functionality
node generate.js --size 0.01 --type txt

# Test different options
node generate.js --size 0.1 --type mp4
node generate.js --name custom.bin
node generate.js --help
```

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Keep lines under 100 characters when possible
- Add comments for complex logic

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when relevant

Examples:
```
Add random data generation option
Fix memory leak in stream handling
Update README with new examples
```

## Feature Ideas

Here are some ideas if you're looking for something to work on:

- **Random data generation** - Option to fill files with random data instead of patterns
- **Multiple file generation** - Generate multiple files at once
- **Progress bar** - Better visual progress with ETA
- **Checksums** - Option to generate MD5/SHA checksums
- **Config files** - Support for configuration files
- **Resume capability** - Resume interrupted file generation
- **Sparse files** - Support for sparse file generation
- **Content types** - Generate files with valid headers for specific types
- **Compression testing** - Include compressible vs non-compressible data options

## Questions?

Feel free to open an issue with your question or reach out through GitHub Discussions.

## Code of Conduct

Be respectful, be kind, and help create a welcoming environment for everyone.

---

Thank you for contributing! 🎉

