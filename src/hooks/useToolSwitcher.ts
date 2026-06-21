import { useState, useCallback, useEffect } from "react";
import type { ToolId, ToolDefinition } from "../types";

const STORAGE_KEY = "composer-active-tools";

function loadPersistedTools(): ToolId[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ToolId[];
  } catch {
    // ignore parse errors
  }
  return [];
}

export function useToolSwitcher() {
  const [activeTools, setActiveTools] = useState<ToolId[]>(loadPersistedTools);
  const [toolConfigs, setToolConfigs] = useState<Record<string, unknown>>({});

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTools));
  }, [activeTools]);

  const activateTool = useCallback((tool: ToolDefinition) => {
    if (tool.disabled) return;
    setActiveTools((prev) => {
      const withoutConflicts = prev.filter(
        (id) => !tool.conflictsWith?.includes(id)
      );
      if (withoutConflicts.includes(tool.id)) return withoutConflicts;
      return [...withoutConflicts, tool.id];
    });
  }, []);

  const deactivateTool = useCallback((id: ToolId) => {
    setActiveTools((prev) => prev.filter((t) => t !== id));
  }, []);

  const toggleTool = useCallback(
    (tool: ToolDefinition) => {
      if (tool.disabled) return;
      if (activeTools.includes(tool.id)) {
        deactivateTool(tool.id);
      } else {
        activateTool(tool);
      }
    },
    [activeTools, activateTool, deactivateTool]
  );

  const updateConfig = useCallback((toolId: ToolId, config: unknown) => {
    setToolConfigs((prev) => ({ ...prev, [toolId]: config }));
  }, []);

  const clearTools = useCallback(() => {
    setActiveTools([]);
    setToolConfigs({});
  }, []);

  return {
    activeTools,
    toolConfigs,
    activateTool,
    deactivateTool,
    toggleTool,
    updateConfig,
    clearTools,
  };
}
