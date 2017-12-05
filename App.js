import React, { Component } from 'react';
import { View } from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import { TabNavigator, StackNavigator } from 'react-navigation';
import DecksList from './components/DecksList';
import NewDeck from './components/NewDeck';
import DeckDetail from './components/DeckDetail';
import NewQuestion from './components/NewQuestion';
import Quiz from './components/Quiz';
import { setLocalNotification } from './utils/helpers';
import { white, lightBlue, black } from './utils/colors';

// TabNavigator Component.
const Tabs = TabNavigator({
  DecksList: {
    screen: DecksList,
    navigationOptions: {
      tabBarLabel: 'Decks'
    }
  },
  NewDeck: {
    screen: NewDeck,
    navigationOptions: {
      tabBarLabel: 'New Deck'
    }
  }
}, {
  tabBarOptions: {
    style: {
      backgroundColor: lightBlue
    },
    labelStyle: {
      color: black
    }
  }
});

// StackNavigator Component.
const MainNavigator = StackNavigator({
  Home: {
    screen: Tabs,
    // Remove the header.
    navigationOptions: {
      header: null
    }
  },
  DeckDetail: {
    screen: DeckDetail,
    navigationOptions: ({navigation}) => ({
      title: `${navigation.state.params.title}`,
      headerStyle: {
        backgroundColor: black,
      },
      // Change the color of the header text.
      headerTitleStyle: {
        color: white
      },
      // Change color to the `back` arrow.
      headerTintColor: white
    })
  },
  NewQuestion: {
    screen: NewQuestion,
    navigationOptions: {
      title: 'Add Card',
      headerStyle: {
        backgroundColor: black,
      },
      headerTitleStyle: {
        color: white
      },
      headerTintColor: white
    }
  },
  Quiz: {
    screen: Quiz,
    navigationOptions: {
      title: 'Quiz',
      headerStyle: {
        backgroundColor: black,
      },
      headerTitleStyle: {
        color: white
      },
      headerTintColor: white
    }
  }
});

class App extends Component {
  componentDidMount() {
    setLocalNotification();
  }

  render() {
    return (
      /*
       * Give this parent Component View a flex value of 1.
       * We want this Component to take up all the available space, so
       * that all the available children Components will be able to
       * expand to the full size of the phone.
       *
       * NOTE: Also be aware that for some reason there seems to be
       * an issue with TabNavigator, that I experienced, which makes the
       * app sometimes show a blank screen.
       * One possible fix suggested in the GitHub open issue page is to make
       * sure the containers are either the height of the device or they
       * have a flex: 1 value.
       */
      <Provider store={createStore(reducer)}>
        <View style={{flex: 1}}>
          <MainNavigator />
        </View>
      </Provider>
    );
  }
}

export default App;