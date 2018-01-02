import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

//React Redux
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import injectTapEventPlugin from 'react-tap-event-plugin';

const store = configureStore();


injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    < App />
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
