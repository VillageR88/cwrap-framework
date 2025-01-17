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

rl.question("Enter project name (default: my-new-cwrap-project): ", (input) => {
  const projectName = input.trim() || "my-new-cwrap-project"; // Default project name

  const projectPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.error(`Directory ${projectPath} already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath, { recursive: true });
  console.log(`Creating a new project in ${projectPath}`);

  const newPackageJson = {
    name: projectName,
    version: "1.0.0",
    main: "index.js",
    scripts: {
      // start: "node start.js && node server.js", //historical function TBDeleted
      build: "node build.js",
      dev: "node cleanup.js dev && node build.js dev && node start.js dev && node server.js dev",
    },
    devDependencies: {
      // "cwrap-framework": "file:../cwrap-framework-0.1.0-rc.202501120242.tgz",
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

  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    JSON.stringify(newPackageJson, null, 2)
  );

  console.log("Installing packages. This might take a couple of minutes.");
  try {
    execSync("npm install", { stdio: "inherit", cwd: projectPath });
  } catch (error) {
    console.error("Error installing packages:", error.message);
    process.exit(1);
  }

  console.log("Packages installed successfully!");

  // Prompt for template choice
  // function promptTemplateChoice() {
  //   console.log("\nChoose the number of the template to install:");
  //   console.log("1 (default): demo");
  //   console.log("2: single-component");
  //   console.log("0: empty");
  //   rl.question("\nEnter your choice: ", (templateChoice) => {
  //     let template;
  //     switch (templateChoice.trim()) {
  //       case "2":
  //         template = "single-component";
  //         break;
  //       case "1":
  //       case "":
  //         template = "demo";
  //         break;
  //       case "0":
  //         template = "empty";
  //         break;
  //       default:
  //         console.log("Invalid choice.");
  //         return promptTemplateChoice(); // Ask again
  //     }
  //     runAdditionalSetup(projectPath, template);
  //     rl.close();
  //   });
  // }
  // promptTemplateChoice();
  runAdditionalSetup(projectPath, "empty");
  rl.close();
});

function runAdditionalSetup(projectPath, template) {
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

  // 14.01.2025 - discontinued
  // // Move cwrapFunctions.js from cwrap to scripts folder if it does not exist
  // const scriptsSrcPath = path.join(cwrapPath, "scripts", "cwrapFunctions.js");
  // const scriptsDestDir = path.join(projectPath, "scripts");
  // const scriptsDestPath = path.join(scriptsDestDir, "cwrapFunctions.js");
  // if (!fs.existsSync(scriptsDestPath)) {
  //   try {
  //     if (!fs.existsSync(scriptsDestDir)) {
  //       fs.mkdirSync(scriptsDestDir, { recursive: true });
  //     }
  //     fs.copyFileSync(scriptsSrcPath, scriptsDestPath);
  //     logMessage("Moved cwrapFunctions.js to scripts folder");
  //   } catch (error) {
  //     logMessage("Error moving cwrapFunctions.js:", error.message);
  //     removeLockFile();
  //     process.exit(1);
  //   }
  // } else {
  //   logMessage("cwrapFunctions.js already exists in the scripts folder");
  // }

  // Remove the lock file
  removeLockFile();

  logMessage("Installation complete");
}
