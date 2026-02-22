#!/usr/bin/env node
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";
import type { ToolData, ToolWithScore, ScoreResult } from "./lib/types.js";
import { computeSovereigntyScore } from "./lib/scoring.js";

const DATA_TOOLS_DIR = join(process.cwd(), "data", "tools");
const GENERATED_DIR = join(process.cwd(), "data", "generated");
const DIST_DIR = join(process.cwd(), "dist");

async function loadAllTools(): Promise<ToolData[]> {
  const files = await readdir(DATA_TOOLS_DIR);
  const yamlFiles = files.filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));
  const tools: ToolData[] = [];

  for (const file of yamlFiles) {
    const path = join(DATA_TOOLS_DIR, file);
    const content = await readFile(path, "utf-8");
    const data = parse(content) as ToolData;
    if (data?.id) {
      tools.push(data);
    }
  }

  return tools;
}

function toToolWithScore(tool: ToolData, result: ScoreResult): ToolWithScore {
  return {
    ...tool,
    sovereignty_score: result.sovereignty_score,
    sovereignty_breakdown: result.sovereignty_breakdown,
    score_confidence: result.score_confidence,
  };
}

async function main(): Promise<void> {
  const tools = await loadAllTools();
  const scores: Record<string, ScoreResult> = {};
  const toolsWithScores: ToolWithScore[] = [];

  for (const tool of tools) {
    const result = computeSovereigntyScore(tool);
    scores[tool.id] = result;
    toolsWithScores.push(toToolWithScore(tool, result));
  }

  await mkdir(GENERATED_DIR, { recursive: true });
  await mkdir(DIST_DIR, { recursive: true });

  await writeFile(
    join(GENERATED_DIR, "scores.json"),
    JSON.stringify(scores, null, 2),
    "utf-8"
  );
  await writeFile(
    join(DIST_DIR, "tools.json"),
    JSON.stringify(toolsWithScores, null, 2),
    "utf-8"
  );

  console.log(`Computed sovereignty scores for ${tools.length} tools.`);
  console.log(`  data/generated/scores.json (for Hugo)`);
  console.log(`  dist/tools.json (full export)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
