// ---------------------------------------------------------------------------
// Command-bar parser.
// Turns a raw query into an ordered result list: recognised intents (things we
// can compute or pre-fill) first, then fuzzy tool matches from the registry.
// ---------------------------------------------------------------------------

import { AVAILABLE_TOOLS, type Tool } from "@/lib/tools";
import { matchIntents, type Intent } from "@/lib/intents";

export type ToolResult = {
  kind: "tool";
  id: string;
  tool: Tool;
  href: string;
};

export type CommandResult = Intent | ToolResult;

/**
 * Score a tool against a query. Higher is better; 0 means no match.
 * Exact/name matches outrank keyword and description hits.
 */
function scoreTool(tool: Tool, q: string): number {
  const name = tool.name.toLowerCase();
  const card = tool.cardDescription.toLowerCase();

  if (name === q) return 1000;
  if (name.startsWith(q)) return 500;

  let score = 0;
  if (name.includes(q)) score += 200;
  if (tool.keywords.some((k) => k.toLowerCase() === q)) score += 180;
  if (tool.keywords.some((k) => k.toLowerCase().includes(q))) score += 90;
  if (card.includes(q)) score += 40;

  if (score === 0 && isSubsequence(q, name)) score += 20;
  return score;
}

/** True if every char of `needle` appears in `haystack` in order. */
function isSubsequence(needle: string, haystack: string): boolean {
  let i = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j++) {
    if (haystack[j] === needle[i]) i++;
  }
  return i === needle.length;
}

export function searchTools(query: string, limit = 6): ToolResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return AVAILABLE_TOOLS.map((tool) => ({ tool, score: scoreTool(tool, q) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
    .slice(0, limit)
    .map(({ tool }) => ({
      kind: "tool" as const,
      id: `tool:${tool.slug}`,
      tool,
      href: `/tools/${tool.slug}`,
    }));
}

/** Build the full, ordered result list for a query. */
export function parseCommand(query: string): CommandResult[] {
  return [...matchIntents(query), ...searchTools(query)];
}
