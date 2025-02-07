import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { HomeScreen } from './src/components/HomeScreen';
import { DetailsScreen } from './src/components/DetailsScreen';
import { SplashScreen } from './src/components/SplashScreen';
import { ThemeProvider } from './src/theme/ThemeContext';
import { Header } from './src/components/Header';
import { PrivacyPolicy } from './src/components/PrivacyPolicy';
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
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false }} />
            <Stack.Screen name="Spin Master" component={HomeScreen} />
            <Stack.Screen name="CM Guide" component={GuideScreen} />
            <Stack.Screen name="Tips" component={Tip1Screen} />
            <Stack.Screen name="Spins" component={SpinScreen} />
            <Stack.Screen name="Collect Spin" component={CollectLink} />
            <Stack.Screen name="Menu" component={Menu} />
            <Stack.Screen name="DefaultScreen" component={DefaultScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ErrorScreen" component={ErrorScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </DataProvider>
    </ThemeProvider>
  );
};

export default App;
