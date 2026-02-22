#!/usr/bin/env node
import { watch } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

const WORKSPACE_ROOT = process.cwd();
const TOOLS_DIR = join(WORKSPACE_ROOT, "data", "tools");
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

let scoreRunning = false;
let rerunRequested = false;
let debounceTimer: NodeJS.Timeout | undefined;

function runCommand(command: string, args: string[]): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: WORKSPACE_ROOT,
      stdio: "inherit",
    });
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

async function runScore(): Promise<void> {
  if (scoreRunning) {
    rerunRequested = true;
    return;
  }
  scoreRunning = true;

  const code = await runCommand(npmCmd, ["run", "score", "--silent"]);
  if (code !== 0) {
    console.error(`score run failed with exit code ${code}`);
  }

  scoreRunning = false;
  if (rerunRequested) {
    rerunRequested = false;
    await runScore();
  }
}

function scheduleScoreRun(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    void runScore();
  }, 250);
}

async function main(): Promise<void> {
  await runScore();

  const hugo = spawn("hugo", ["server"], {
    cwd: WORKSPACE_ROOT,
    stdio: "inherit",
  });

  const watcher = watch(TOOLS_DIR, { persistent: true }, (_event, filename) => {
    if (!filename) return;
    if (filename.endsWith(".yaml") || filename.endsWith(".yml")) {
      scheduleScoreRun();
    }
  });

  const cleanup = () => {
    watcher.close();
    if (!hugo.killed) {
      hugo.kill("SIGTERM");
    }
  };

  process.on("SIGINT", () => {
    cleanup();
    process.exit(130);
  });
  process.on("SIGTERM", () => {
    cleanup();
    process.exit(143);
  });

  hugo.on("exit", (code) => {
    cleanup();
    process.exit(code ?? 0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
