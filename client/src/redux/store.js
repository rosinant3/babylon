import { createStore } from 'redux';
import enter from './reducers';

// const enhancers = compose(window.__REDUX_DEVTOOLS_EXTENSION__());

const store = createStore(enter, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;