import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TabNavigator} from 'react-navigation';

const screens = require('./app/layouts');

const Layouts = TabNavigator({
  Record: {
    screen: screens.Record
  },
  Results: {
    screen: screens.Results
  },
  Compare: {
    screen: screens.Compare
  }
}, {
  tabBarOptions: {
    activeTintColor: '#fff',
    inactiveTintColor: '#D1D1D1',
    style: {
      backgroundColor: '#303955',
    },
    indicatorStyle: {
        backgroundColor: 'white',
    },
  },
});

// gets the current screen from navigation state
function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

export default class App extends React.Component {
  state = {
    currentScreen: ''
  }
  render() {
    return <Layouts
      onNavigationStateChange={(prevState, currentState) => {
      const currentScreen_New = getCurrentRouteName(currentState);
      const prevScreen = getCurrentRouteName(prevState);
      if (prevScreen !== currentScreen_New) {
        this.setState({currentScreen: currentScreen_New})
      }
    }}
      screenProps={{
      currentScreen: this.state.currentScreen
      }}/>;
  }
}
