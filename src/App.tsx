import { useAtom } from "jotai";
import "./App.css";
import logo from "./logo.svg";
import { windowsAtom, IWindow } from "./stores";

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
  console.log("> windows:");
  console.log(windows);
  // Render a ul of window debug info
  let windowDebugInfo = windows.map((window, index) => {
    return (
      <li key={index}>
        <p>Window {index}</p>
        <p>Window ID: {window.id}</p>
        <p>Window tab length: {window.tabs && window.tabs.length}</p>
      </li>
    );
  });

  return (
    <div className="App">
      <main>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <ul>{windowDebugInfo}</ul>
        {/* Button to trigger logging of `windows` */}
        <button onClick={() => logWindowsAndTabs(windows)}>Log Windows</button>
        {/* <button onClick={() => console.log(windows)}>Log Windows</button> */}
      </main>
    </div>
  );
}

export default App;
