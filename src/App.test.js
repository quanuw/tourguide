import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import App, { Search, Cards, Card } from './App';

describe('App', () => {
	
	it('renders without crashing', () => {
	  const div = document.createElement('div');
	  ReactDOM.render(<App />, div);
	  ReactDOM.unmountComponentAtNode(div);
	});

	test('has a valid snapshot', () => {
		const component = renderer.create(
			<App />
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

});


describe('Search', () => {

	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Search>Search</Search>, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	test('has a valid snapshot', () => {
		const component = renderer.create(
			<Search>Search</Search>
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

});

// TODO: These test snapshots doesn't seem to work. How to use jest with nested components?
describe('Cards', () => {

	const props = {
		list: [
			{ artist: '1', venue: '1', date: '1', price: '1', objectID: '1' },
			{ artist: '2', venue: '2', date: '2', price: '2', objectID: '2' },
		],
	};

	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Cards {...props} />, div);
	});

	test('has a valid snapshot', () => {
		const component = renderer.create(
			<Cards {...props} />
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

});

describe('Card', () =>  {
	const props = {
		artist: '1', venue: '1', date: '1', price: '1', objectID: '1'
	};

	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Card {...props} />, div);
	});

	test('has a valid snapshot', () => {
		const component = renderer.create(
			<Card {...props} />
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

});
