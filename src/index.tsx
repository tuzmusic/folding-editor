import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';
import model from './redux/reducers/model.slice';
import TextEntryModel from './models/TextEntryModel';

export type AppState = {
  model: TextEntryModel
}

const reducer = combineReducers({ model });
const store = configureStore({ reducer });

const ConnectedApp =
  <Provider store={ store }>
    <App/>
  </Provider>;

ReactDOM.render(ConnectedApp, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
