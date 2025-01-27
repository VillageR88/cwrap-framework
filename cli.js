#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");
const readline = require("node:readline");

// Path to the package.json file
const packageJsonPath = path.join(__dirname, "package.json");

// Read and parse the package.json file
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

// Extract the version of cwrap-framework
const cwrapFrameworkVersion = packageJson.version;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query, validationFn, callback) {
  rl.question(query, (input) => {
    if (validationFn(input)) {
      callback(input);
    } else {
      console.log("Invalid input. Please enter a valid response.");
      askQuestion(query, validationFn, callback);
    }
  });
}

function validateYesNo(input) {
  const validResponses = ["yes", "y", "no", "n", ""];
  return validResponses.includes(input.trim().toLowerCase());
}

askQuestion(
  "Enter project name (default: my-new-cwrap-project): ",
  () => true,
  (input) => {
    const projectName = input.trim() || "my-new-cwrap-project"; // Default project name

    const projectPath = path.resolve(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
      console.error(`Directory ${projectPath} already exists.`);
      process.exit(1);
    }

    fs.mkdirSync(projectPath, { recursive: true });
    console.log(`Creating a new project in ${projectPath}`);

    askQuestion(
      "Do you want to install TypeScript? (Yes/No, default: no): ",
      validateYesNo,
      (typescriptInput) => {
        const installTypeScript = ["yes", "y"].includes(
          typescriptInput.trim().toLowerCase() || "n"
        );

        askQuestion(
          "Do you want to install Webpack? (Yes/No, default: no): ",
          validateYesNo,
          (webpackInput) => {
            const installWebpack = ["yes", "y"].includes(
              webpackInput.trim().toLowerCase() || "n"
            );

            const newPackageJson = {
              name: projectName,
              version: "1.0.0",
              main: "index.js",
              scripts: {
                build: "node build.js",
                dev: "node cleanup.js dev && node build.js dev && node start.js dev && node server.js dev",
              },
              devDependencies: {
                // "cwrap-framework":
                //   "file:../cwrap-framework-0.1.0-rc.202501252151.tgz",
                "cwrap-framework": cwrapFrameworkVersion,
                "body-parser": "^1.20.2",
                express: "^4.17.1",
                "fs-extra": "^11.2.0",
                "connect-livereload": "^0.6.1",
                "cross-env": "^7.0.3",
                livereload: "^0.9.3",
                mkdirp: "^3.0.1",
                "serve-static": "^1.14.1",
                jsdom: "^25.0.1",
              },
            };

            if (installTypeScript) {
              newPackageJson.devDependencies.typescript = "^5.7.3";
              newPackageJson.scripts["compile:dev"] =
                "tsc -p tsconfig.dev.json";
              newPackageJson.scripts["compile:prod"] =
                "tsc -p tsconfig.prod.json";
            }

            if (installWebpack) {
              newPackageJson.devDependencies.webpack = "^5.97.1";
              newPackageJson.devDependencies["webpack-cli"] = "^6.0.1";
              newPackageJson.scripts["build:dev"] =
                "webpack --mode development";
              newPackageJson.scripts["build:prod"] =
                "webpack --mode production";
            }

            fs.writeFileSync(
              path.join(projectPath, "package.json"),
              JSON.stringify(newPackageJson, null, 2)
            );

            console.log(
              "Installing packages. This might take a couple of minutes."
            );
            try {
              execSync("npm install", { stdio: "inherit", cwd: projectPath });
            } catch (error) {
              console.error("Error installing packages:", error.message);
              process.exit(1);
            }

            console.log("Packages installed successfully!");

            runAdditionalSetup(
              projectPath,
              "empty",
              installTypeScript,
              installWebpack
            );
            rl.close();
          }
        );
      }
    );
  }
);

function runAdditionalSetup(
  projectPath,
  template,
  installTypeScript,
  installWebpack
) {
  const cwrapPath = path.join(projectPath, "node_modules", "cwrap-framework");
  const logFilePath = path.join(projectPath, "installation.log");
  const lockFilePath = path.join(projectPath, "postinstall.lock");

  // Function to log messages to a file
  function logMessage(...messages) {
    const logEntry = messages
      .map((msg) => `${new Date().toISOString()} - ${msg}`)
      .join(" ");
    fs.appendFileSync(logFilePath, `${logEntry}\n`);
  }

  // Function to check if the script is already running
  function isScriptRunning() {
    return fs.existsSync(lockFilePath);
  }

  // Function to create a lock file
  function createLockFile() {
    fs.writeFileSync(lockFilePath, "");
  }

  // Function to remove the lock file
  function removeLockFile() {
    fs.unlinkSync(lockFilePath);
  }

  // Function to copy a folder recursively
  function copyFolderSync(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        copyFolderSync(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  // Check if the script is already running
  if (isScriptRunning()) {
    logMessage("Script is already running. Exiting.");
    process.exit(0);
  }

  // Create a lock file to prevent multiple executions
  createLockFile();

  // Log the projectPackageJsonPath
  const projectPackageJsonPath = path.join(projectPath, "package.json");
  logMessage("projectPackageJsonPath:", projectPackageJsonPath);

  // Check if the project's package.json exists
  if (!fs.existsSync(projectPackageJsonPath)) {
    // Create a new package.json if it doesn't exist
    const newPackageJson = {
      name: "new-project",
      version: "1.0.0",
      description: "",
      main: "index.js",
      scripts: {
        start: "node server.js",
      },
      keywords: [],
      author: "",
      license: "ISC",
    };
    fs.writeFileSync(
      projectPackageJsonPath,
      JSON.stringify(newPackageJson, null, 2)
    );
    logMessage("Created new package.json");
  }

  // Create the routes folder in the root directory of the project
  const routesPath = path.join(projectPath, "routes");
  if (!fs.existsSync(routesPath)) {
    fs.mkdirSync(routesPath);
    logMessage("Created routes folder in the root directory of the project");
  } else {
    logMessage(
      "Routes folder already exists in the root directory of the project"
    );
  }

  // Copy the contents of the chosen template folder from lib/templates to routes if it does not exist
  const templateSrcPath = path.join(cwrapPath, "lib", "templates", template);
  if (fs.existsSync(templateSrcPath)) {
    try {
      const templateEntries = fs.readdirSync(templateSrcPath, {
        withFileTypes: true,
      });
      for (const entry of templateEntries) {
        const srcPath = path.join(templateSrcPath, entry.name);
        const destPath = path.join(routesPath);
        if (entry.isDirectory()) {
          copyFolderSync(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
      logMessage(`Copied contents of ${template} folder to routes folder`);
    } catch (error) {
      logMessage(
        `Error copying contents of ${template} folder:`,
        error.message
      );
      removeLockFile();
      process.exit(1);
    }
  } else {
    logMessage(`${template} folder does not exist in the lib/templates folder`);
  }

  // Move server.js from cwrap to root folder if it does not exist
  const serverSrcPath = path.join(cwrapPath, "server.js");
  const serverDestPath = path.join(projectPath, "server.js");
  if (!fs.existsSync(serverDestPath)) {
    try {
      fs.copyFileSync(serverSrcPath, serverDestPath);
      logMessage("Moved server.js to root folder");
    } catch (error) {
      logMessage("Error moving server.js:", error.message);
      removeLockFile();
      process.exit(1);
    }
  } else {
    logMessage("server.js already exists in the root folder");
  }

  // Move start.js from cwrap to root folder if it does not exist
  const startSrcPath = path.join(cwrapPath, "start.js");
  const startDestPath = path.join(projectPath, "start.js");
  if (!fs.existsSync(startDestPath)) {
    try {
      fs.copyFileSync(startSrcPath, startDestPath);
      logMessage("Moved start.js to root folder");
    } catch (error) {
      logMessage("Error moving start.js:", error.message);
      removeLockFile();
      process.exit(1);
    }
  }

  // Create .gitignore file in the root folder if it does not exist
  const gitignoreDestPath = path.join(projectPath, ".gitignore");
  const gitignoreContent = `
/dist
/build
/node_modules
installation.log
error.html
.gitignore
  `;
  if (!fs.existsSync(gitignoreDestPath)) {
    try {
      fs.writeFileSync(gitignoreDestPath, gitignoreContent.trim());
      logMessage("Created .gitignore in root folder");
    } catch (error) {
      logMessage("Error creating .gitignore:", error.message);
      removeLockFile();
      process.exit(1);
    }
  } else {
    logMessage(".gitignore already exists in the root folder");
  }

  // Move build.js from cwrap to root folder if it does not exist
  const buildSrcPath = path.join(cwrapPath, "build.js");
  const buildDestPath = path.join(projectPath, "build.js");
  if (!fs.existsSync(buildDestPath)) {
    try {
      fs.copyFileSync(buildSrcPath, buildDestPath);
      logMessage("Moved build.js to root folder");
    } catch (error) {
      logMessage("Error moving build.js:", error.message);
      removeLockFile();
      process.exit(1);
    }
  } else {
    logMessage("build.js already exists in the root folder");
  }

  const cleanupSrcPath = path.join(cwrapPath, "cleanup.js");
  const cleanupDestPath = path.join(projectPath, "cleanup.js");
  if (!fs.existsSync(cleanupDestPath)) {
    try {
      fs.copyFileSync(cleanupSrcPath, cleanupDestPath);
      logMessage("Moved cleanup.js to root folder");
    } catch (error) {
      logMessage("Error moving cleanup.js:", error.message);
      removeLockFile();
      process.exit(1);
    }
  } else {
    logMessage("cleanup.js already exists in the root folder");
  }

  // Move sortStyles.js from cwrap to root folder if it does not exist
  const sortStylesSrcPath = path.join(cwrapPath, "sortStyles.js");
  const sortStylesDestPath = path.join(projectPath, "sortStyles.js");
  if (!fs.existsSync(sortStylesDestPath)) {
    try {
      fs.copyFileSync(sortStylesSrcPath, sortStylesDestPath);
      logMessage("Moved sortStyles.js to root folder");
    } catch (error) {
      logMessage("Error moving sortStyles.js:", error.message);
      removeLockFile();
      process.exit(1);
    }
  } else {
    logMessage("sortStyles.js already exists in the root folder");
  }

  // Move cwrapConfig.js from cwrap to root folder if it does not exist
  const cwrapConfigSrcPath = path.join(cwrapPath, "cwrapConfig.js");
  const cwrapConfigDestPath = path.join(projectPath, "cwrapConfig.js");
  if (!fs.existsSync(cwrapConfigDestPath)) {
    try {
      fs.copyFileSync(cwrapConfigSrcPath, cwrapConfigDestPath);
      logMessage("Moved cwrapConfig.js to root folder");
    } catch (error) {
      logMessage("Error moving cwrapConfig.js:", error.message);
      removeLockFile();
      process.exit(1);
    }
  } else {
    logMessage("cwrapConfig.js already exists in the root folder");
  }

  // Move schema folder from cwrap to root folder if it does not exist
  const schemaSrcPath = path.join(cwrapPath, "schema");
  const schemaDestPath = path.join(projectPath, "schema");
  if (!fs.existsSync(schemaDestPath)) {
    try {
      copyFolderSync(schemaSrcPath, schemaDestPath);
      logMessage("Moved schema folder to root folder");
    } catch (error) {
      logMessage("Error moving schema folder:", error.message);
      process.exit(1);
    }
  } else {
    logMessage("schema folder already exists in the root folder");
  }

  // Move static folder from cwrap to root folder if it does not exist
  const staticSrcPath = path.join(cwrapPath, "static");
  const staticDestPath = path.join(projectPath, "static");
  if (!fs.existsSync(staticDestPath)) {
    try {
      copyFolderSync(staticSrcPath, staticDestPath);
      logMessage("Moved static folder to root folder");
    } catch (error) {
      logMessage("Error moving static folder:", error.message);
      process.exit(1);
    }
  } else {
    logMessage("static folder already exists in the root folder");
  }

  // Move .vscode folder from cwrap to root folder if it does not exist
  const vscodeSrcPath = path.join(cwrapPath, ".vscode");
  const vscodeDestPath = path.join(projectPath, ".vscode");
  if (!fs.existsSync(vscodeDestPath)) {
    try {
      copyFolderSync(vscodeSrcPath, vscodeDestPath);
      logMessage("Moved .vscode folder to root folder");
    } catch (error) {
      logMessage("Error moving .vscode folder:", error.message);
      process.exit(1);
    }
  } else {
    logMessage(".vscode folder already exists in the root folder");
  }

  // Move .github folder from cwrap to root folder if it does not exist
  const githubSrcPath = path.join(cwrapPath, ".github");
  const githubDestPath = path.join(projectPath, ".github");
  if (!fs.existsSync(githubDestPath)) {
    try {
      copyFolderSync(githubSrcPath, githubDestPath);
      logMessage("Moved .github folder to root folder");
    } catch (error) {
      logMessage("Error moving .github folder:", error.message);
      process.exit(1);
    }
  } else {
    logMessage(".github folder already exists in the root folder");
  }

  // Copy TypeScript configuration files if TypeScript is installed
  if (installTypeScript) {
    const tsConfigFiles = [
      "biome.json",
      "tsconfig.dev.json",
      "tsconfig.prod.json",
    ];
    for (const file of tsConfigFiles) {
      const srcPath = path.join(cwrapPath, file);
      const destPath = path.join(projectPath, file);
      if (!fs.existsSync(destPath)) {
        try {
          fs.copyFileSync(srcPath, destPath);
          logMessage(`Moved ${file} to root folder`);
        } catch (error) {
          logMessage(`Error moving ${file}:`, error.message);
          removeLockFile();
          process.exit(1);
        }
      } else {
        logMessage(`${file} already exists in the root folder`);
      }
    }
  }

  // Copy Webpack configuration file if Webpack is installed
  if (installWebpack) {
    const webpackConfigSrcPath = path.join(cwrapPath, "webpack.config.js");
    const webpackConfigDestPath = path.join(projectPath, "webpack.config.js");
    if (!fs.existsSync(webpackConfigDestPath)) {
      try {
        fs.copyFileSync(webpackConfigSrcPath, webpackConfigDestPath);
        logMessage("Moved webpack.config.js to root folder");
      } catch (error) {
        logMessage("Error moving webpack.config.js:", error.message);
        removeLockFile();
        process.exit(1);
      }
    } else {
      logMessage("webpack.config.js already exists in the root folder");
    }
  }

  // Remove the lock file
  removeLockFile();

  logMessage("Installation complete");
}
