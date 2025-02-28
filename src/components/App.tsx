import { useState } from 'react';
import reactLogo from '../assets/react.svg';
import { WithAuth } from './WithAuth';

function App() {
  const [count, setCount] = useState(0);

  return (
    <WithAuth>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div>
        <button className="flex bg-amber-400" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </WithAuth>
  );
}

export default App;
