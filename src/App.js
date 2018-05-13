import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'

import GoogMapReact from 'google-map-react';
import {markerStyle, markerStyleHover} from './marker_with_hover_styles.js';

import './App.css';

const DEFAULT_QUERY = 'wtf';

const PATH_BASE = 'http://api.songkick.com/api/3.0/';
const PATH_ARTISTS = 'artists/';
const PATH_FORMAT = 'calendar.json';
const PATH_API_KEY= 'apikey=';
const PATH_QUERY = 'query='
const API_KEY = 'GfkmyNpagiIxeyzZ';

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
      center: {lat: 59.95, lng: 30.33},
    }

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchTours = this.fetchTours.bind(this);
    this.needsToSearchTours = this.needsToSearchTours.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  onMouseOver(event, data) {
    console.log(data);
    const center = data; 
    this.setState({ center })
  }

  // find artist id:
  // TODO: Create path constants
  fetchArtistId(searchTerm) {
    this.setState({ isLoading: true });
    axios(`${PATH_BASE}search/artists.json?${PATH_API_KEY}${API_KEY}&${PATH_QUERY}${searchTerm}`)
      .then(result => this._isMounted && this.fetchTours(result.data))
      .catch(error => this._isMounted && this.handleError(error));
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
      .catch(error => this._isMounted && this.handleError(error));
      console.log(artistId);
      console.log(this._isMounted);
  }

  handleError(error) {
    this.setState({ error });
    if (error) {
      this.setState({ isLoading: false});
    }
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
      center

    } = this.state;

    const list = (
      results &&
      results[searchKey]
      ) || [];

    const zoom = 11;
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
          {/* 
          Need to add scrolling to venue list 
          Reference: https://www.robinwieruch.de/react-infinite-scroll/ 
          */}
          { error != null ? <p> {searchTerm} has no tours. </p>
            : false}
          { isLoading ? <Loading/>
            : false}
          { !isLoading && list.length ? <Cards
                                          list={list}
                                          onHover={this.onMouseOver}
                                        >
                                        </Cards>
                                        : false
          }
        </div>
        { !isLoading && list.length ? <Map center={center} zoom={zoom} list={list} />
          : false
        }
        
      </div>
    );
  }
}

class Map extends Component {

  static defaultProps = {
    center: {lat: 59.95, lng: 30.33},
    zoom: 11
  };
 
  constructor(props) {
    super(props);

    // TODO: Need to refactor.
    // Card class uses the same functions. 
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
      list
    } = this.props;
    

    const places = list.map(item => 
      <Marker
        key={item.id}
        id={item.id}
        lat={item.location.lat}
        lng={item.location.lng}
        venue={item.venue.displayName}
        city={item.location.city}
        date={item.start.date}
      />
    );
    // TODO: Hover area seems to be off center.
    return (
      <div className="map-wrapper">
        <div className="map">
            <GoogMapReact
              center={this.props.center}
              zoom={this.props.zoom}
              hoverDistance={75}
              distanceToMouse={this._distanceToMouse}

            >
              {places}

            </GoogMapReact>
        </div>
      </div>
    );
  }
}

class Marker extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props)
  }

  render() {
    const style = this.props.$hover ? markerStyleHover : markerStyle;
    if (!this.props.$hover) {
      return (
        <div key={this.props.id} style={markerStyle}>
          {this.props.venue}
        </div>
      );
    } else {
      return (
        <div key={this.props.id} style={markerStyleHover}>
          {this.props.venue}
          <span> {this.props.city} </span>
          <span> {this.props.date} </span>
        </div>
      );
    }
  }
}

const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <div className="search-wrapper">
    <div className="search">
      <form onSubmit={onSubmit}> 
        <input 
          className="input"
          type="text" 
          value={value} 
          onChange={onChange} 
        /> 
        <button type="submit"> 
          {children} 
        </button> 
      </form>
    </div>
  </div>

  Search.PropTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  }

// TODO: Bind hover event of markers to onHover of cards.
// refer: https://plot.ly/javascript/hover-events/#triggering-hover-events
class Cards extends Component {

  constructor(props) {
    super(props);

    this.onMouseOver = this.onMouseOver.bind(this);
  }
  
  onMouseOver(event, data) {
    this.props.onHover(event, data);
  }
  render() {
    const { list } = this.props;
    return (
      <div className="cards">
        {list.map(item => 

          <Card
            key={item.id}
            id={item.id}
            venue={item.venue.displayName}
            city={item.location.city}
            date={item.start.date}
            lat={item.location.lat}
            lng={item.location.lng}
            onHover={this.onMouseOver}
          />

        )};
      </div>
    );
  }
}

  // Cards.PropTypes = {
  //   list: PropTypes.array.isRequired
  // }

class Card extends Component {

  constructor(props) {
    super(props);

    this.stringToHash = this.stringToHash.bind(this);
    this.hashToHex = this.hashToHex.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);

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
  
  onMouseOver(event, data) {
    // TODO: Issue with subplots
    // Cannot read property '_subplot' of undefined
    //Plotly.Fx.hover('plot', [{curveNumber: 0, pointNumber: 0}]);
    const center = {lat: this.props.lat, lng: this.props.lng}
    this.props.onHover(event, center);
  }

  onMouseOut(event) {
 
  }

  render() {
    const {
      id,
      venue,
      city,
      date,
      price,
    } = this.props;

    const color = this.hashToHex(this.stringToHash(venue));

    return(
      <div key={id} className="card" style={{backgroundColor: color}} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
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
