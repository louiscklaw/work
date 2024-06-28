const execSync = require("child_process").execSync;
const fs = require("fs");
const path = require("path");

// Function to get all subdirectories of a given directory
function getDirectories(srcPath, excludeDirs) {
  return fs
    .readdirSync(srcPath)
    .filter(
      (file) =>
        !excludeDirs.includes(file) &&
        fs.lstatSync(path.join(srcPath, file)).isDirectory()
    )
    .map((name) => path.join(srcPath, name));
}

// Get current working directory
const cwd = process.cwd();

// Path to app-head directory
const appHeadDir = path.join(cwd, "project");

// Check if app-head exists
if (!fs.existsSync(appHeadDir)) {
  console.error(`Error: ${appHeadDir} does not exist.`);
  process.exit(1);
}

// Execute reset.bat scripts
try {
  // execSync(`cmd /c "cd ${appHeadDir} && scripts\\reset.bat"`, { stdio: 'inherit' });
} catch (err) {
  console.error(`Error executing reset.bat script: ${err.message}`);
  process.exit(1);
}

// Define excluded directories
const excludedDirs = [".next", "node_modules", ".git", "volumes", "_mp4"];

// Copy app-head directory and its contents to a new directory with an increasing number suffix
let maxNum = 0;
const directories = getDirectories(cwd, excludedDirs);
for (const dir of directories) {
  const match = dir.match(/^.+draft(\d+)$/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num > maxNum) {
      maxNum = num;
    }
  }
}

var zerofilled = ("0000" + (maxNum + 1)).slice(-4);
const targetDir = path.join(cwd, `draft${zerofilled}`);
fs.mkdirSync(targetDir);

// Copy app-head directory and its contents to targetDir, excluding specified directories
fs.cpSync(appHeadDir, targetDir, {
  filter: (src) => !excludedDirs.includes(path.basename(src)),
  recursive: true,
});

console.log(`Successfully copied ${appHeadDir} to ${targetDir}.`);
