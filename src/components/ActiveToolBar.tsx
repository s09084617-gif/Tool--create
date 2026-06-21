import type { ToolId } from "../types";
import { getToolById } from "../registry/tools";

interface ActiveToolBarProps {
  activeTools: ToolId[];
  removeTool: (id: ToolId) => void;
}

export function ActiveToolBar({ activeTools, removeTool }: ActiveToolBarProps) {
  if (activeTools.length === 0) return null;

  return (
    <div
      className="active-tool-bar"
      role="list"
      aria-label="Active tools"
    >
      {activeTools.map((id) => {
        const tool = getToolById(id);
        return (
          <span key={id} className="active-tool-bar__badge" role="listitem">
            <span>{tool?.icon}</span>
            <span>{tool?.label ?? id}</span>
            <button
              type="button"
              aria-label={`Remove ${tool?.label ?? id}`}
              onClick={() => removeTool(id)}
              className="active-tool-bar__remove"
            >
              ×
            </button>
          </span>
        );
      })}
    </div>
  );
}
