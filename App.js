import React from 'react';
import Navigation from './src/Navigation';
import {Provider} from 'react-redux';
import {store} from './src/redux/Store';
import { LogBox } from 'react-native';

const App = () => {
  LogBox.ignoreAllLogs();
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App;