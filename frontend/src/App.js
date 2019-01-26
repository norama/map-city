import React, { Component } from 'react';
import './App.css';

import WeatherMap from './components/WeatherMap';

class App extends Component {

  render() {
    return (
      <div className="App">
        <WeatherMap />
      </div>
    );
  }
}

export default App;
