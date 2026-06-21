import { useRef, useEffect, useCallback } from "react";
import { TOOL_REGISTRY } from "../registry/tools";
import type { ToolId, ToolDefinition } from "../types";

interface ToolMenuProps {
  activeTools: ToolId[];
  onToggle: (tool: ToolDefinition) => void;
  onClose: () => void;
}

export function ToolMenu({ activeTools, onToggle, onClose }: ToolMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const focusItem = useCallback((index: number) => {
    const items = menuRef.current?.querySelectorAll<HTMLButtonElement>(
      "button[role='menuitemcheckbox']:not(:disabled)"
    );
    items?.[index]?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const items = Array.from(
        menuRef.current?.querySelectorAll<HTMLButtonElement>(
          "button[role='menuitemcheckbox']:not(:disabled)"
        ) ?? []
      );
      const focused = document.activeElement as HTMLButtonElement;
      const idx = items.indexOf(focused);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        focusItem((idx + 1) % items.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        focusItem((idx - 1 + items.length) % items.length);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [focusItem, onClose]
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Focus first item when opened
  useEffect(() => {
    focusItem(0);
  }, [focusItem]);

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Available AI tools"
      className="tool-menu"
      onKeyDown={handleKeyDown}
    >
      <div className="tool-menu__header">Tools</div>
      {TOOL_REGISTRY.map((tool) => {
        const isActive = activeTools.includes(tool.id);
        return (
          <button
            key={tool.id}
            type="button"
            role="menuitemcheckbox"
            aria-checked={isActive}
            aria-disabled={tool.disabled}
            disabled={tool.disabled}
            onClick={() => onToggle(tool)}
            className={`tool-menu__item${isActive ? " tool-menu__item--checked" : ""}${tool.disabled ? " tool-menu__item--disabled" : ""}`}
          >
            <span className="tool-menu__item-icon">{tool.icon}</span>
            <span className="tool-menu__item-body">
              <span className="tool-menu__item-label">{tool.label}</span>
              <span className="tool-menu__item-desc">{tool.description}</span>
            </span>
            <span className="tool-menu__item-check" aria-hidden>
              {isActive ? "✓" : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}
