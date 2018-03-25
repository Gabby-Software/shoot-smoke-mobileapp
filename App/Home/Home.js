import React, { Component } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';

import About from '../About';
import config from '../config.json';
import getCurrentPosition from './utils/getCurrentPosition';
import Header from '../Header';
import Map from '../Map';
import pm25ToCigarettes from './utils/pm25ToCigarettes';
import * as theme from '../utils/theme';

export default class Home extends Component {
  state = {
    api: null,
    gps: null,
    isAboutVisible: false,
    isMapVisible: false
  };

  componentWillMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      this.setState({ api: null, loadingGps: true });
      const { coords } = await getCurrentPosition();
      this.setState({ gps: coords });
      const { data: response } = await axios.get(
        `http://api.waqi.info/feed/geo:${coords.latitude};${
          coords.longitude
        }/?token=${config.waqiToken}`
      );
      if (response.status === 'ok') {
        this.setState({ api: response.data });
      } else {
        throw new Error(response.data);
      }
    } catch (err) {}
  }

  handleAboutHide = () => this.setState({ isAboutVisible: false });

  handleAboutShow = () => this.setState({ isAboutVisible: true });

  handleMapHide = () => this.setState({ isMapVisible: false });

  handleMapShow = () => this.setState({ isMapVisible: true });

  render() {
    const { api, gps, isAboutVisible, isMapVisible } = this.state;
    return (
      <View style={styles.container}>
        <Header api={api} hidden={!api} onLocationClick={this.handleMapShow} />

        <View style={styles.main}>{this.renderText()}</View>

        <TouchableOpacity onPress={this.handleAboutShow}>
          <Text style={[styles.footer, api ? null : styles.hidden]}>
            Click to understand how we did the math.
          </Text>
        </TouchableOpacity>

        <About onRequestClose={this.handleAboutHide} visible={isAboutVisible} />
        {api && (
          <Map
            api={api}
            gps={gps}
            station={{
              description: api.attributions.length
                ? api.attributions[0].name
                : null,
              latitude: api.city.geo[0],
              longitude: api.city.geo[1],
              title: api.city.name
            }}
            onRequestClose={this.handleMapHide}
            visible={isMapVisible}
          />
        )}
      </View>
    );
  }

  renderPresentPast = () => {
    const { api } = this.state;
    const time = api.time.s.split(':')[0];

    if (time < 15) return "You'll smoke";
    return 'You smoked';
  };

  renderShit = () => {
    const { api } = this.state;
    const cigarettes = pm25ToCigarettes(api.iaqi.pm25.v);

    if (cigarettes <= 1) return 'Oh';
    if (cigarettes < 5) return 'Shit';
    if (cigarettes < 15) return 'Fuck';
    return 'WTF';
  };

  renderText = () => {
    const { api, gps } = this.state;

    if (!gps)
      return (
        <Text style={styles.shit}>
          Fetching GPS coordinates<Text style={styles.dots}>{'\n'}...</Text>
        </Text>
      );

    if (!api)
      return (
        <Text style={styles.shit}>
          Retrieving air data<Text style={styles.dots}>{'\n'}...</Text>
        </Text>
      );

    return (
      <Text style={styles.shit}>
        {this.renderShit()}! {this.renderPresentPast()}{' '}
        <Text style={styles.cigarettesCount}>
          {pm25ToCigarettes(api.iaqi.pm25.v)} cigarette{pm25ToCigarettes(
            api.iaqi.pm25.v
          ) === 1
            ? ''
            : 's'}
        </Text>{' '}
        today.
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  cigarettesCount: {
    color: theme.primaryColor,
    fontFamily: 'gotham-black',
    fontSize: 50
  },
  container: {
    ...theme.fullScreen,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  dots: {
    color: theme.primaryColor
  },
  footer: {
    ...theme.withPadding,
    ...theme.text,
    ...theme.link,
    marginBottom: 22
  },
  hidden: {
    opacity: 0
  },
  main: {
    ...theme.withPadding
  },
  shit: {
    color: theme.textColor,
    fontFamily: 'gotham-black',
    fontSize: 50
  }
});
