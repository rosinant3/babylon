import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from "react-redux";
import store from './redux/store';


ReactDOM.render(<BrowserRouter>

<Provider store={store}><Route component={App}/></Provider>

</BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
