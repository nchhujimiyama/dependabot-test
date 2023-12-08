import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Markdown } from './common/Markdown';
import markdownFile from './articles/test.md';

const App: React.FC = () => {
  const [mdText, setMdText] = React.useState('');

  React.useEffect(() => {
    fetch(markdownFile)
      .then((m) => {
        return m.text();
      })
      .then((md) => {
        setMdText(md);
      });
  }, []);

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
      </header>
      <Markdown content={mdText} />
    </div>
  );
};

export default App;
