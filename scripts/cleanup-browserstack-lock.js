const { execSync } = require("child_process");

function killWindowsProcess(imageName) {
  try {
    execSync(`taskkill /IM ${imageName} /F /T`, { stdio: "ignore" });
  } catch (_) {
    // Ignore when process is not running or cannot be terminated.
  }
}

function main() {
  if (process.platform !== "win32") {
    return;
  }

  killWindowsProcess("BrowserStackLocal.exe");
  killWindowsProcess("binary-win-x64.exe");

  try {
    execSync("timeout /T 1 /NOBREAK >NUL", { stdio: "ignore" });
  } catch (_) {
    // no-op
  }
}

main();
