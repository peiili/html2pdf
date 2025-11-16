# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a server-side HTML to PDF conversion tool using Puppeteer. The project is designed to convert web pages to PDF documents through a backend service.

## Development Environment

- **System**: Ubuntu 22.04
- **Node.js**: Version 20.9
- **Main Dependency**: Puppeteer 24.29.1

## System Dependencies

Before running this project, ensure the following system dependencies are installed:

```bash
sudo apt update
sudo apt install libasound2 libatk-bridge2.0-0 libatk1.0-0 libatspi2.0-0 libc6 \
  libcairo2 libcups2 libdbus-1-3 libdrm2 libexpat1 libgbm1 libglib2.0-0 \
  libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libudev1 \
  libuuid1 libx11-6 libx11-xcb1 libxcb-dri3-0 libxcb1 libxcomposite1 \
  libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxkbcommon0 \
  libxrandr2 libxrender1 libxshmfence1 libxss1 libxtst6
```

## Project Structure

- `package.json` - Project configuration and dependencies
- `index.js` - Main application entry point (currently empty)
- `README.md` - Project documentation in Chinese

## Development Commands

Currently, the project has minimal npm scripts:

```bash
# Install dependencies
npm install

# Test (currently outputs error as no tests are configured)
npm test
```

## Architecture Notes

- The project uses Puppeteer for headless browser automation
- Main functionality is intended to be implemented in `index.js`
- This is a Chinese-language project with documentation primarily in Chinese
- The codebase is in early development stage with core functionality yet to be implemented

## Implementation Status

The main application code (`index.js`) is currently empty. Future development should focus on:

1. Implementing the HTML to PDF conversion logic using Puppeteer
2. Adding proper error handling and input validation
3. Creating API endpoints or command-line interface
4. Adding configuration options for PDF generation (page size, margins, etc.)