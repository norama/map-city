import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';

import Main from './components/Main';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Main />
        <ToastContainer />
      </div>
    );
  }
}

export default App;
