import { useState, useCallback, useEffect, useRef } from "react";
import type { useToolSwitcher } from "../hooks/useToolSwitcher";
import { ActiveToolBar } from "./ActiveToolBar";
import { ToolMenu } from "./ToolMenu";
import { ToolChip } from "./ToolChip";
import { ToolConfigPanel } from "./ToolConfigPanel";
import { TOOL_REGISTRY } from "../registry/tools";
import type { MessagePayload, ToolId } from "../types";

interface ComposerProps {
  toolSwitcher: ReturnType<typeof useToolSwitcher>;
  onSend?: (payload: MessagePayload) => void;
}

export default function Composer({ toolSwitcher, onSend }: ComposerProps) {
  const { activeTools, toolConfigs, toggleTool, updateConfig, deactivateTool } =
    toolSwitcher;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const openToolMenu = useCallback(() => setMenuOpen(true), []);
  const closeToolMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        setMenuOpen((prev) => !prev);
      }
      if (e.key === "Escape" && menuOpen) {
        closeToolMenu();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [menuOpen, closeToolMenu]);

  const submit = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    if (
      /\b(generate|create|draw|make)\b.*(image|picture|photo)/i.test(trimmed) &&
      !activeTools.includes("image-generation")
    ) {
      setError('Tip: Enable "Image Generation" tool for best results.');
    } else {
      setError(undefined);
    }

    const payload: MessagePayload = {
      message: trimmed,
      tools: activeTools as ToolId[],
      toolConfigs,
    };

    try {
      setLoading(true);
      // Simulated send — replace with real API call
      await new Promise((res) => setTimeout(res, 700));
      onSend?.(payload);
      setMessage("");
      setSuccessMsg("Sent!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch {
      setError("Failed to send. Please try again.");
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }, [message, activeTools, toolConfigs, loading, onSend]);

  const handleTextareaKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void submit();
      }
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        openToolMenu();
      }
    },
    [submit, openToolMenu]
  );

  return (
    <div className="composer" aria-busy={loading}>
      <ActiveToolBar activeTools={activeTools} removeTool={deactivateTool} />

      <div
        className="composer__toolbar"
        role="toolbar"
        aria-label="Tool shortcuts"
      >
        {TOOL_REGISTRY.map((tool) => (
          <ToolChip
            key={tool.id}
            tool={tool}
            active={activeTools.includes(tool.id)}
            onToggle={() => toggleTool(tool)}
          />
        ))}

        <button
          ref={menuButtonRef}
          type="button"
          className="composer__menu-btn"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Open tool menu (Ctrl+/)"
          onClick={() => (menuOpen ? closeToolMenu() : openToolMenu())}
        >
          ⊞ Tools
        </button>
      </div>

      {menuOpen && (
        <div className="composer__menu-wrapper">
          <ToolMenu
            activeTools={activeTools}
            onToggle={toggleTool}
            onClose={closeToolMenu}
          />
        </div>
      )}

      {activeTools.map((id) => {
        const tool = TOOL_REGISTRY.find((t) => t.id === id);
        if (!tool?.requiresConfig) return null;
        return (
          <ToolConfigPanel
            key={id}
            tool={tool}
            value={toolConfigs[id]}
            onChange={(cfg) => updateConfig(id, cfg)}
          />
        );
      })}

      <textarea
        ref={textareaRef}
        className="composer__textarea"
        aria-label="Message"
        placeholder={
          activeTools.length > 0
            ? `Message with ${activeTools.length} tool${activeTools.length > 1 ? "s" : ""} active…`
            : "Type a message… (Enter to send · Shift+Enter for new line · Ctrl+/ for tools)"
        }
        value={message}
        rows={4}
        disabled={loading}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleTextareaKeyDown}
      />

      <div className="composer__footer">
        {error && (
          <div role="alert" className="composer__error">
            ⚠ {error}
          </div>
        )}
        {successMsg && (
          <div aria-live="polite" className="composer__success">
            ✓ {successMsg}
          </div>
        )}
        <div className="composer__footer-right">
          {activeTools.length > 0 && (
            <span className="composer__active-count" aria-live="polite">
              {activeTools.length} tool{activeTools.length > 1 ? "s" : ""} active
            </span>
          )}
          <button
            type="button"
            className="composer__submit"
            onClick={() => void submit()}
            disabled={loading || !message.trim()}
            aria-label={loading ? "Sending message" : "Send message"}
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
