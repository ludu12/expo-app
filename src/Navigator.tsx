import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from './auth';
import Splash from './Splash';
import SignIn from './SignIn';
import { Button } from 'react-native';
import Profile from './Profile';

const Stack = createStackNavigator();

const Navigator: React.FC = () => {
  const { state } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {state.isLoading ? (
          // We haven't finished checking for the token yet
          <Stack.Screen name="Splash" component={Splash} />
        ) : state.userToken == null ? (
          // No token found, user isn't signed in
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{
              title: 'Sign in',
              // When logging out, a pop animation feels intuitive
              animationTypeForReplace: state.isSignout ? 'pop' : 'push'
            }}
          />
        ) : (
          // User is signed in
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={({ navigation }) => ({
                headerRight: function HeaderRight() {
                  return <Button title="Profile" onPress={() => navigation.navigate('Profile')} />;
                }
              })}
            />
            <Stack.Screen name="Profile" component={Profile} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
