import React from 'react';
import * as Font from 'expo-font';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, Stack, Actions } from 'react-native-router-flux';
import { PersistGate } from 'redux-persist/es/integration/react';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Root, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import theme from '../native-base-theme/variables/commonColor';

import Routes from './routes/index';
import Loading from './components/UI/Loading';

class App extends React.Component {
  constructor() {
    super();
    this.state = { loading: true, logged: false };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    });

    

    this.setState({ loading: false });
  }

  // onStateChange = async (e) => {
  //   const res = await AsyncStorage.getItem('@Auth:logged');
  //   console.log(res);
  //   const logged = res ? JSON.parse(res) : false; 
  //   // if (!logged) {
  //   //  Actions.home();
  //   //  return
  //   // }
    
  // }

  render() {
    const { loading, logged } = this.state;
    const { store, persistor } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Root>
        <Provider store={store}>
          <PersistGate loading={<Loading />} persistor={persistor}>
            <StyleProvider style={getTheme(theme)}>
              <Router>
                <Stack key="root">{Routes}</Stack>
              </Router>
            </StyleProvider>
          </PersistGate>
        </Provider>
      </Root>
    );
  }
}

App.propTypes = {
  store: PropTypes.shape({}).isRequired,
  persistor: PropTypes.shape({}).isRequired,
};

export default App;
