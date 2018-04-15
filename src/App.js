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

const updateSearchToursState = (result) => (prevState) => {
  const { searchKey, results } = prevState;
  const resultPage = list.filter(item => item.artist.toLowerCase() === result.toLowerCase());
  const oldResultPages = results && results[searchKey]
    ? results[searchKey]
    : [];
  const updatedResultsPages = [
    ...oldResultPages,
    ...resultPage
    ];
  return {
    results: { ...results,
      [searchKey]: updatedResultsPages
    }
  };
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchTerm: DEFAULT_QUERY,
      searchKey: 'LOLOL',
      error: null,
    }

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchTours = this.fetchTours.bind(this);
    this.needsToSearchTours = this.needsToSearchTours.bind(this);
  }

  fetchTours(searchTerm) {
    axios(`${PATH_BASE}${PATH_ARTISTS}${searchTerm}/${PATH_FORMAT}?${PATH_API_KEY}${API_KEY}`) 
      .then(result => this.setTours(result.data))
      .catch(error => this.setState({ error }));
      console.log(searchTerm);
      console.log(this._isMounted);
  }

  componentDidMount() {
    console.log("Component mounted");
    const { searchTerm } = this.state;
    this.setState({ searchKey : searchTerm});
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  needsToSearchTours(searchTerm) {
    return !this.state.results || !this.state.results[searchTerm];
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey : searchTerm });
    console.log(this.state.searchKey);
    // TODO: Can't fetch. Need an API KEY from song kick. Use const list for now.
    // this.fetchTours(searchTerm);
    if (this.needsToSearchTours(searchTerm)) {
      this.setTours(searchTerm);
    }
    event.preventDefault();
  }

  setTours(result) {
    //const { resultPage } = result;
    // const { searchKey, results } = this.state;
    // const resultPage = list.filter(item => item.artist.toLowerCase() === result.toLowerCase());
    // const oldResultPages = results && results[searchKey]
    // ? results[searchKey]
    // : [];
  

    // const updatedResultsPages = [
    //   ...oldResultPages,
    //   ...resultPage
    // ];

    // this.setState(prevState => {
    //   const { searchKey, results } = this.state;
    //   const resultPage = list.filter(item => item.artist.toLowerCase() === result.toLowerCase());
    //   const oldResultPages = results && results[searchKey]
    //     ? results[searchKey]
    //     : [];
    //   const updatedResultsPages = [
    //     ...oldResultPages,
    //     ...resultPage
    //     ];
    //   return {
    //     results: { ...results,
    //       [searchKey]: updatedResultsPages
    //     }
    //   };
    // });
    this.setState(updateSearchToursState(result));
    // console.log(oldResultPages);
    // console.log(resultPage);
    // console.log(updatedResultsPages);
    // console.log(searchKey);
    console.log(this.state.results);
  }


  render() {

    const { 
      searchTerm,
      searchKey,
      results,
      error,
    } = this.state;

    const list = (
      results &&
      results[searchKey]
      ) || [];

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
          {results && 
            <Cards
              list={list}
            >
            </Cards>
          }
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
const Cards = ({
  list,
}) => 
  <div className="cards">
    {list.map(item => 

      <Card
        key={item.objectID}
        venue={item.venue}
        date={item.date}
        price={item.price}
      />

    )};
  </div>

  Cards.PropTypes = {
    list: PropTypes.array.isRequired
  //   hashFunc: PropTypes.func,
  //   RGBFunc: PropTypes.func,
  }

class Card extends Component {

  constructor(props) {
    super(props);

    this.stringToHash = this.stringToHash.bind(this);
    this.hashToHex = this.hashToHex.bind(this);
  }

  stringToHash(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  hashToHex(i) {
     var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "#" + "00000".substring(0, 6 - c.length) + c;
  }
  
  render() {
    const {
      venue,
      date,
      price,
    } = this.props;

    const color = this.hashToHex(this.stringToHash(venue));
    console.log(color);

    return(
      <div className="card" style={{backgroundColor: color}}>
        <div className="card-venue">
            <span className="venue">{venue}</span>
        </div>
        <div className="card-info">
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
