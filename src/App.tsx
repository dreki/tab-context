import { useAtom } from 'jotai';
import ReactMarkdown from 'react-markdown';
import './App.css';
import logo from './logo.svg';
import MarkdownLog from './models/MarkdownLog';
import { windowsAtom } from './stores';

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

function App() {
  // const windows = useWindowStore(state: => state.windows);
  // const windows = useWindowStore((state: WindowState) => state.windows);
  
  const [windows] = useAtom(windowsAtom);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
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
    </div>
  );
}

export default App;
