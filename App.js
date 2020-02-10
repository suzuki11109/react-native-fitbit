/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';
import {authorize} from 'react-native-app-auth';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const config = {
  clientId: '22BKSC',
  clientSecret: '0c5e219987cf1d7204077ee316141986',
  redirectUrl: 'mppy://fit',
  scopes: ['activity', 'sleep'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://www.fitbit.com/oauth2/authorize',
    tokenEndpoint: 'https://api.fitbit.com/oauth2/token',
    revocationEndpoint: 'https://api.fitbit.com/oauth2/revoke',
  },
};

const App: () => React$Node = () => {
  const [auth, setAuth] = useState({});
  const [steps, setSteps] = useState([]);
  const handleClickLogin = () => {
    console.log('clicked');
    authorize(config)
      .then(authState => {
        console.log(authState);
        setAuth(authState);
      })
      .catch(error => {
        console.log('failed');
        console.log(error);
      });
  };

  useEffect(() => {
    if (auth.accessToken) {
      getData(auth.accessToken)
        .then(result => {
          console.log(result['activities-steps']);
          setSteps(result['activities-steps']);
        });
    }
  }, [auth]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <Text>Hello</Text>
            <Button title="Login" onPress={handleClickLogin} />
          </View>
          <View style={styles.body}>
            {steps.map(step => (
              <Text>Date: {step.dateTime} Steps: {step.value}</Text>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

function getData(token) {
  const today = new Date();
  const mm = ('' + today.getMonth() + 1).slice(-2);
  const dd = ('' + today.getDate()).slice(-2);
  const date = `${today.getFullYear()}-${mm}-${dd}`;
  return fetch('https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.log(error);
    });
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
