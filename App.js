import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, StatusBar } from 'react-native';
import { HomeScreen } from './src/components/HomeScreen';
import { DetailsScreen } from './src/components/DetailsScreen';
import { SplashScreen } from './src/components/SplashScreen';
import { ThemeProvider } from './src/theme/ThemeContext';
import { Header } from './src/components/Header';
import { GuideScreen, Tip1Screen } from './src/components/Screens/GuideScreen';
import { theme } from './src/theme/theme';
import { SpinScreen } from './src/components/Screens/SpinScreen';
import { WelcomeScreen } from './src/components/Screens/WelcomeScreen';
import { DefaultScreen } from './src/components/Screens/DefaultScreen';
import { ErrorScreen } from './src/components/Screens/ErrorScreen';
import { DataProvider } from './src/service/DataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu } from './src/components/Screens/Menu';
import { CollectLink } from './src/components/Screens/CollectLink';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { Language } from './src/components/Screens/Language';

const Stack = createNativeStackNavigator();

const App = () => {

  // const clearOnboardingStatus = async () => {
  //   try {
  //     await AsyncStorage.removeItem('isTermsAccepted');
  //   } catch (error) {
  //     console.log('Error clearing onboarding status:', error);
  //   }
  // };

  // useEffect(() => {
  //   clearOnboardingStatus();
  // }, []);

  // useEffect(() => {
  //   requestPermissionAndroid()
  // }, [])

  // const requestPermissionAndroid = async () => {
  //   if (Platform.OS === 'android' && Platform.Version >= 33) {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         console.log("✅ Notification Permission Granted");
  //         getToken();
  //       } else {
  //         console.log("❌ Notification Permission Denied");
  //       }
  //     } catch (err) {
  //       console.warn("Error requesting permissions:", err);
  //     }
  //   } else {
  //     console.log("Skipping permission request for API < 33");
  //     getToken(); // Call getToken directly for older Android versions
  //   }
  // };


  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log("FCM Message Received in Foreground: ", remoteMessage);
  //     Alert.alert('New Notification', remoteMessage.notification?.title || 'No Title');
  //   });

  //   return () => {
  //     console.log("Cleaning up foreground messaging listener...");
  //     unsubscribe();
  //   };
  // }, []);

  // const getToken = async () => {
  //   try {
  //     const token = await messaging().getToken();
  //     console.log("✅ Token is:", token);
  //   } catch (error) {
  //     console.error("❌ Error getting FCM token:", error);
  //   }
  // };


  return (
    <ThemeProvider>
      <DataProvider>
        <NavigationContainer>
          <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
          <Stack.Navigator
            screenOptions={({ route }) => ({
              header: ({ navigation }) => (
                <Header
                  title={route.name}
                  onBack={navigation.canGoBack() ? () => navigation.goBack() : null}
                />
              ),
            })}
          >
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DetailsScreen" component={DetailsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Spin Master" component={HomeScreen} />
            <Stack.Screen name="CM Guide" component={GuideScreen} />
            <Stack.Screen name="Tips" component={Tip1Screen} />
            <Stack.Screen name="Spins" component={SpinScreen} />
            <Stack.Screen name="Collect Spin" component={CollectLink} />
            <Stack.Screen name="Settings" component={Menu} />
            <Stack.Screen name="DefaultScreen" component={DefaultScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ErrorScreen" component={ErrorScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Language" component={Language} />
          </Stack.Navigator>
        </NavigationContainer>
      </DataProvider>
    </ThemeProvider>
  );
};

export default App;