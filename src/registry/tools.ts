import type { ToolDefinition } from "../types";

export const TOOL_REGISTRY: ToolDefinition[] = [
  {
    id: "web-search",
    label: "Web Search",
    description: "Search the web before responding",
    icon: "🔍",
  },
  {
    id: "code-interpreter",
    label: "Code Interpreter",
    description: "Run Python or JavaScript code",
    icon: "💻",
    requiresConfig: true,
    configSchema: {
      runtime: ["Python", "JavaScript"],
    },
    conflictsWith: ["image-generation"],
  },
  {
    id: "image-generation",
    label: "Image Generation",
    description: "Generate images from text prompts",
    icon: "🎨",
    conflictsWith: ["code-interpreter"],
  },
  {
    id: "file-analysis",
    label: "File Analysis",
    description: "Analyze uploaded files",
    icon: "📂",
  },
  {
    id: "reasoning",
    label: "Deep Reasoning",
    description: "Spend more time thinking through problems",
    icon: "🧠",
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOL_REGISTRY.find((t) => t.id === id);
}
