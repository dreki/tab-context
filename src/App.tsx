import { useAtom } from "jotai";
import "./App.css";
import logo from "./logo.svg";
import { windowsAtom, IWindow } from "./stores";
import { WindowList } from "./components/WindowList";

/**
 * Log all window IDs and the titles of their tabs. Log as JSON string.
 * @param windows Array of windows
 */
function logWindowsAndTabs(windows: IWindow[]) {
  const windowTabs: { tabs: { title: String }[] }[] = [];
  for (let window of windows) {
    if (!window.tabs) {
      continue;
    }
    const tabTitles: String[] = window.tabs.map((tab) => tab.title) as String[];
    windowTabs.push({ tabs: tabTitles.map((title) => ({ title })) });
  }
  console.log(JSON.stringify(windowTabs));
}

function App() {
  const [windows] = useAtom(windowsAtom);
  return (
    <div className="p-2">
      <h1>Windows</h1>
      <WindowList windows={windows} />
    </div>
  );
}

export default App;
