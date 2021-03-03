import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import './App.css';
import HostSession from './HostSession';
import JoinSession from './JoinSession';
import MainMenu from './MainMenu';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/host-session/:sessionId">
            <HostSession />
          </Route>
          <Route path="/join-session/:sessionId">
            <JoinSession />
          </Route>
          <Route path="/">
            <MainMenu />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
