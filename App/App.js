import React, { Component } from 'react';
import { Font } from 'expo';

import Home from './Home';
import LoadingBackground from './Loading/Background';

export default class App extends Component {
  state = {
    fontLoaded: false
  };

  async componentDidMount() {
    await Font.loadAsync({
      'gotham-black': require('../assets/fonts/Gotham-Black.ttf'),
      'gotham-book': require('../assets/fonts/Gotham-Book.ttf')
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    return this.state.fontLoaded ? <Home /> : <LoadingBackground />;
  }
}
