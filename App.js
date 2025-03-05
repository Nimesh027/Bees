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
import { SpinScreen } from './src/components/Screens/SpinScreen';
import { WelcomeScreen } from './src/components/Screens/WelcomeScreen';
import { DefaultScreen } from './src/components/Screens/DefaultScreen';
import { ErrorScreen } from './src/components/Screens/ErrorScreen';
import { DataProvider } from './src/service/DataContext';
import { Menu } from './src/components/Screens/Menu';
import { CollectLink } from './src/components/Screens/CollectLink';
import { Language } from './src/components/Screens/Language';
import StatusBarManager from './src/commonComponents/StatusBarManager';

const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <ThemeProvider>
      <DataProvider>
          <StatusBarManager />
        <NavigationContainer>
          <StatusBar backgroundColor="#8A2BE2" barStyle="light-content" />
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