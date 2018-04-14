import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './App.css';

const DEFAULT_QUERY = 'wtf';

const PATH_BASE = 'http://api.songkick.com/api/3.0/';
const PATH_ARTISTS = 'artists/';
const PATH_FORMAT = 'calendar.json';
const PATH_API_KEY= 'apikey=';
const API_KEY = '';
// const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

const list = [
  {
    artist: "Fall Out Boy",
    venue: "Paramount",
    date: "04-09-18",
    price: "10.00",
  },
  {
    artist: "Taylor Swift",
    venue: "Nemos",
    date: "04-09-18",
    price: "15.00",
  }
];

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchTerm: DEFAULT_QUERY,
      error: null,
    }

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchTours = this.fetchTours.bind(this);
  }

  fetchTours(searchTerm) {
    axios(`${PATH_BASE}${PATH_ARTISTS}${searchTerm}/${PATH_FORMAT}?${PATH_API_KEY}${API_KEY}`) 
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({ error }));
      console.log(searchTerm);
      console.log(this._isMounted);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchTours(searchTerm);
    event.preventDefault();
  }

  setTours(result) {
    const { resultPage } = result;

    const oldResultPages = this.state.results !== null
      ? this.state.results
      : []

    const updatedResultsPages = [
      ...oldResultPages,
      ...resultPage
    ];

    this.setState({
      results: updatedResultsPages
    })
  }

  



  render() {

    const { 
      searchTerm, 
      results,
      error,
    } = this.state;

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
          <Cards 
            hashFunc={this.stringToHash}
            RGBFunc={this.hashToRGB}
          >
          </Cards>
        </div>
      </div>
    );
  }
}

const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <form onSubmit={onSubmit}> 
    <input 
      type="text" 
      value={value} 
      onChange={onChange} 
    /> 
    <button type="submit"> 
      {children} 
    </button> 
  </form>

  Search.PropTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  }

// TODO: How to change background color based on venue hash?
const Cards = () => 
  <div className="cards">
    {list.map(item => 

      <Card
        venue={item.venue}
        date={item.date}
        price={item.price}
      />

    )};
  </div>

  // Cards.PropTypes = {
  //   hashFunc: PropTypes.func,
  //   RGBFunc: PropTypes.func,
  // }

class Card extends Component {

  constructor(props) {
    super(props);

    this.stringToHash = this.stringToHash.bind(this);
    this.hashToRGB = this.hashToRGB.bind(this);
  }

 

  stringToHash(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  hashToRGB(i) {
     var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }
  

  render() {
    const {
      venue,
      date,
      price,
    } = this.props;

    const color = '#' + this.hashToRGB(this.stringToHash(venue));
    console.log(color);
    
    return(
      <div className="card" style={{backgroundColor: color}}>
        <div className="card-venue">
            <span className="venue">{venue}</span>
        </div>
        <div class="card-info">
          <span className="date">DATE: {date}</span>
          <span className="price">PRICE: {price}</span>
          <span className="buy-link">
            <a href="https://www.songkick.com/">BUY TICKET</a>
          </span>
        </div>
      </div>
    );
  }
}

  




  
  


export default App;
