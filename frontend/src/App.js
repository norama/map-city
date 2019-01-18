import React, { Component } from 'react';
import './App.css';

import WeatherMap from './components/WeatherMap';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Map Weather</h1>
          <div className="App-help">
            <div>
              <div className="App-help-item"><div className="App-help-click">Click on map / search location:</div> place marker with weather data</div>
              <div className="App-help-item"><div className="App-help-click">Drag marker:</div> display weather data at modified location</div>
            </div>
          </div>
        </header>
        <WeatherMap />
      </div>
    );
  }
}

export default App;
