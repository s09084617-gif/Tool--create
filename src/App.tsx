import { useState } from "react";
import Composer from "./components/Composer";
import { useToolSwitcher } from "./hooks/useToolSwitcher";
import type { MessagePayload } from "./types";
import "./index.css";

export default function App() {
  const [lastPayload, setLastPayload] = useState<MessagePayload | null>(null);
  const toolSwitcher = useToolSwitcher();

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Composer — Tool Switching</h1>
        <p className="app__subtitle">
          Ctrl+/ to open tool menu · Enter to send · Shift+Enter for new line
        </p>
      </header>

      <Composer onSend={setLastPayload} toolSwitcher={toolSwitcher} />

      {lastPayload && (
        <div className="app__payload">
          <h2>Last payload sent to AI</h2>
          <pre>{JSON.stringify(lastPayload, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
