///////////////////////////////////////////////////////////////////////////////
//
// Tribal Climate Tools
// Copyright (c) 2019 Northeast Regional Climate Center, Cornell University
// All Rights Reserved
//
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import ReactDOM from 'react-dom';
import "core-js/stable";
import "regenerator-runtime/runtime";

//Components
import App from './components/App';

//Styles
import './styles/index.css';

//Mobx
import store from './stores';
import { Provider } from 'mobx-react';

//import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
//registerServiceWorker();
