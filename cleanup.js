const fs = require('fs-extra');
const path = require('node:path');

// Path to your build directory
const buildDir = path.resolve(__dirname, 'build');
const isDevelopment = process.env.NODE_ENV === 'development';

if (fs.existsSync(buildDir)) {
  fs.removeSync(buildDir);
  if (!isDevelopment) {
    console.log(`Deleted existing build directory: ${buildDir}`);
  }
}
