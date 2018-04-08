import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

DEFAULT_QUERY = ''
class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchTerm: DEFAULT_QUERY,
    }
  }

  this.onSearchChange = this.onSearchChange.bind(this);
  this.onSearchSubmit = this.onSearchSubmit.bind(this);

  
  render() {
    return (
      <div className="App">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          > 
            Search
          </Search>
        </div>
      </div>
    );
  }
}

export default App;
