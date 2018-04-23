import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import Plot from 'react-plotly.js';
import './App.css';

const DEFAULT_QUERY = 'wtf';

const PATH_BASE = 'http://api.songkick.com/api/3.0/';
const PATH_ARTISTS = 'artists/';
const PATH_FORMAT = 'calendar.json';
const PATH_API_KEY= 'apikey=';
const PATH_QUERY = 'query='
const API_KEY = 'GfkmyNpagiIxeyzZ';
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
  const events = result.resultsPage.results.event;

  return {
    results: { ...results,
      [searchKey]: events
    },
    isLoading: false
  };
}

class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchTerm: DEFAULT_QUERY,
      searchKey: 'LOLOL',
      error: null,
      isLoading: false,
    }

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchTours = this.fetchTours.bind(this);
    this.needsToSearchTours = this.needsToSearchTours.bind(this);
  }

  // find artist id:
  // TODO: Create path constants
  fetchArtistId(searchTerm) {
    this.setState({ isLoading: true });
    axios(`${PATH_BASE}search/artists.json?${PATH_API_KEY}${API_KEY}&${PATH_QUERY}${searchTerm}`)
      .then(result => this._isMounted && this.fetchTours(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
  }

  // TODO: Need to fetch twice.
  // 1. Get correct id of artist
  // 2. Get tour data with the id
  fetchTours(artistResult) {
    const { searchTerm } = this.state;
    const res = artistResult.resultsPage.results.artist.filter(item => item.displayName.toLowerCase() == searchTerm.toLowerCase());
    const artistId = res[0].id;
    axios(`${PATH_BASE}${PATH_ARTISTS}${artistId}/${PATH_FORMAT}?${PATH_API_KEY}${API_KEY}`) 
      .then(result => this._isMounted && this.setTours(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
      console.log(artistId);
      console.log(this._isMounted);
  }

  componentDidMount() {
    this._isMounted = true;
    console.log("Component mounted");
    const { searchTerm } = this.state;
    this.setState({ searchKey : searchTerm});
  }

  componentWillUnmount() {
    this._isMounted = false;
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
    
    if (this.needsToSearchTours(searchTerm)) {
      this.fetchArtistId(searchTerm);
      console.log('fetch');
    }
    event.preventDefault();
  }

  setTours(result) {
    console.log(result);
    this.setState(updateSearchToursState(result));
  }

  render() {

    const { 
      searchTerm,
      searchKey,
      results,
      error,
      isLoading,
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
          { isLoading ? <Loading/> 
            : <Cards
                list={list}
              >
              </Cards>
          }
        </div>
        <Map/>
      </div>
    );
  }
}

class Map extends Component {
 
  constructor(props) {
    super(props);
  }

  render() {
    const data = [{
      type:'scattergeo',
      lat:['45.5017'],
      lon:['-73.5673'],
      mode:'markers',
      marker: {
        size:14
      },
      text:['Montreal']
    }]

    const layout = {
      autosize: true,
      hovermode:'closest',
      mapbox: {
        bearing:0,
        center: {
          lat:45,
          lon:-73
        },
        pitch:0,
        zoom:5
      },
    }

    return (
      <Plot data={data} layout={layout} />
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
        venue={item.venue.displayName}
        city={item.location.city}
        date={item.start.date}
        //price={item.price}
      />

    )};
  </div>

  Cards.PropTypes = {
    list: PropTypes.array.isRequired
  }

class Card extends Component {

  constructor(props) {
    super(props);

    this.stringToHash = this.stringToHash.bind(this);
    this.hashToHex = this.hashToHex.bind(this);
  }

  stringToHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  hashToHex(i) {
     let c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "#" + "00000".substring(0, 6 - c.length) + c;
  }
  
  render() {
    const {
      key,
      venue,
      city,
      date,
      price,
    } = this.props;

    const color = this.hashToHex(this.stringToHash(venue));
    console.log(city);

    return(
      <div key={key} className="card" style={{backgroundColor: color}}>
        <div className="card-venue">
            <span className="venue">{venue}</span>
        </div>
        <div className="card-info">
          <span className="city">CITY: {city}</span>
          <span className="date">DATE: {date}</span>
          <span className="price">PRICE: 10</span>
          <span className="buy-link">
            <a href="https://www.songkick.com/">BUY TICKET</a>
          </span>
        </div>
      </div>
    );
  }
}

const Loading = () =>
  <div>
    <FontAwesomeIcon id="loading-icon" icon={faSpinner} spin />
  </div>


export default App;

export {
  Search,
  Cards,
  Card,
};
