import React, { Component } from 'react';
import OnIdle from '@modus/react-idle';
import Simple from './containers/Simple/index.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <OnIdle>
          <Simple />
        </OnIdle>
      </div>
    );
  }
}

export default App;
