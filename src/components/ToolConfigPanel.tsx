import type { ToolDefinition } from "../types";

interface ToolConfigPanelProps {
  tool: ToolDefinition;
  value: unknown;
  onChange: (v: unknown) => void;
}

type ConfigValue = { runtime?: string } | Record<string, unknown>;

export function ToolConfigPanel({ tool, value, onChange }: ToolConfigPanelProps) {
  if (!tool.requiresConfig || !tool.configSchema) return null;

  const config = (value ?? {}) as ConfigValue;
  const runtimes = tool.configSchema["runtime"] as string[] | undefined;

  return (
    <div
      role="region"
      aria-label={`${tool.label} configuration`}
      className="tool-config-panel"
    >
      {runtimes && (
        <label className="tool-config-panel__label">
          <span>Runtime</span>
          <select
            className="tool-config-panel__select"
            value={
              (config as { runtime?: string }).runtime ??
              runtimes[0]
            }
            onChange={(e) =>
              onChange({ ...(config as object), runtime: e.target.value })
            }
          >
            {runtimes.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
