/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

// Handles background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background Message Received:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
