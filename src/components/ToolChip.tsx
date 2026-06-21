import type { ToolDefinition } from "../types";

interface ToolChipProps {
  tool: ToolDefinition;
  active: boolean;
  onToggle: () => void;
}

export function ToolChip({ tool, active, onToggle }: ToolChipProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={`${tool.label}: ${tool.description}`}
      disabled={tool.disabled}
      onClick={onToggle}
      title={tool.description}
      className={`tool-chip${active ? " tool-chip--active" : ""}${tool.disabled ? " tool-chip--disabled" : ""}`}
    >
      {tool.icon && <span className="tool-chip__icon">{tool.icon}</span>}
      <span className="tool-chip__label">{tool.label}</span>
    </button>
  );
}
