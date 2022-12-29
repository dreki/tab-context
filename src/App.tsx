import { useAtom } from 'jotai';
import ReactMarkdown from 'react-markdown';
import './App.css';
import logo from './logo.svg';
import MarkdownLog from './models/MarkdownLog';
import { windowsAtom, IWindow } from './stores';

let log = new MarkdownLog();
log.add('Hello there!');

class NameHolder {
  constructor(public name: string) { }
}

let nameHolder: NameHolder = new NameHolder('Cool name');

// Functional component for viewing a MarkdownLog
function MarkdownLogView(props: { log: MarkdownLog }) {
  console.log(`> Rendering MarkdownLogView with ${props.log.entries.length} entries`);
  return (
    <ReactMarkdown key={props.log.entries.length}
      children={props.log.joinAll()} />
  );
}

function NameBlaster(props: { name: NameHolder }) {
  console.log(`> Rendering NameBlaster with name ${props.name.name}`);
  return (
    <div>
      <h1>{props.name.name}</h1>
    </div>
  );
}

console.log('hello from App.tsx');

let stringName = 'A Cool Name';

function StringNameDisplay(props: { name: string }) {
  console.log(`> Rendering StringNameDisplay with name ${props.name}`);
  return (
    <div>
      <h1>{props.name}</h1>
    </div>
  );
}

function updateStringName(newStringName: string) {
  console.log(`> Updating string name to ${newStringName}`);
  stringName = newStringName;
}

/**
 * Log all window IDs and the titles of their tabs. Log as JSON string.
 * @param windows Array of windows
 */
// function logWindowsAndTabs(windows: chrome.windows.Window[]) {
function logWindowsAndTabs(windows: IWindow[]) {
  // console.log('> Windows and tabs:');
  // windows.forEach((window, index) => {
  //   console.log(`Window ${index}:`);
  //   console.log(`Window ID: ${window.id}`);
  //   console.log(`Window tab length: ${window.tabs && window.tabs.length}`);
  // });

  const windowTabs: { tabs: { title: String }[] }[] = [];
  for (let window of windows) {
    // console.log(`Window ID: ${window.id}`);
    // console.log(`Window tab length: ${window.tabs && window.tabs.length}`);
    if (!window.tabs) {
      continue;
    }
    const tabTitles: String[] = window.tabs.map(tab => tab.title) as String[];
    // windowTabs.push({title: tabTitles.join(', ')});
    windowTabs.push({ tabs: tabTitles.map(title => ({ title })) });
  }
  console.log(JSON.stringify(windowTabs));

  // console.log('> Windows and tabs:');
  // console.log(JSON.stringify(windows));

}

function App() {
  // const windows = useWindowStore(state: => state.windows);
  // const windows = useWindowStore((state: WindowState) => state.windows);
  
  const [windows] = useAtom(windowsAtom);
  console.log('> windows:')
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
      <header className="App-header">
        {/* <ReactMarkdown children={'Hello there'} /> */}
        {/* <ReactMarkdown children={log.entries.join("\n")} /> */}
        <MarkdownLogView log={log} />
        <button onClick={() => log.add('neat')}>Add Log</button>
        {/* >Check Tabs API</button> */}

        <NameBlaster name={nameHolder} />
        <button onClick={() => nameHolder.name = 'New name'}>Change Name</button>

        <StringNameDisplay key={stringName} name={stringName} />
        <button onClick={() => updateStringName('New string name')}>Change String Name</button>
      </header>

      <main>
        <ul>
          {windowDebugInfo}
        </ul>
        {/* Button to trigger logging of `windows` */}
        <button onClick={() => logWindowsAndTabs(windows)}>Log Windows</button>
        {/* <button onClick={() => console.log(windows)}>Log Windows</button> */}
      </main>
    </div>
  );
}

export default App;
