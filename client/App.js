import React, {useEffect, useMemo, useReducer} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/screens/HomeScreen';
import Login from './src/screens/LoginScreen';
import Search from './src/screens/SearchScreen';
import SearchUser from './src/screens/SearchUserScreen';
import Register from './src/screens/RegisterScreen';
import SplashScreen from './src/screens/SplashScreen';
import ChangePassword from './src/screens/ChangePasswordScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from './src/components/Context';

const Stack = createNativeStackNavigator();

const App = ({navigation}) => {
  const isLogin = AsyncStorage.getItem('userToken');

  useEffect(() => {
    checkToken();
  }, [isLogin]);

  const checkToken = async () => {
    let getToken = await AsyncStorage.getItem('userToken');
  };

  const initialLoginState = {
    isLoading: true,
    userToken: null,
    userRole: null,
    userName: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIVE_TOKEN':
        return {
          ...prevState,
          userName: action.name,
          userToken: action.token,
          userRole: action.role,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.name,
          userToken: action.token,
          userRole: action.role,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          userRole: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = useMemo(
    () => ({
      signIn: async (userToken, userRole, userName) => {
        try {
          await AsyncStorage.setItem('userToken', userToken);
          await AsyncStorage.setItem('userName', userName);
          await AsyncStorage.setItem('userRole', userRole);
        } catch (e) {
          console.log(e);
        }
        dispatch({
          type: 'LOGIN',
          token: userToken,
          name: userName,
          role: userRole,
        });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGOUT'});
      },
    }),
    [],
  );

  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        userName = await AsyncStorage.getItem('userName');
        userRole = await AsyncStorage.getItem('userRole');
      } catch (e) {
        console.log(e);
      }
      dispatch({
        type: 'RETRIVE_TOKEN',
        token: userToken,
        name: userName,
        role: userRole,
      });
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" headerMode="screen">
          {loginState.userToken !== null ? (
            <>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{title: null, headerShown: false}}
              />
              <Stack.Screen
                name="Search"
                component={Search}
                options={{title: null, headerShown: false}}
              />
              <Stack.Screen
                name="SearchUser"
                component={SearchUser}
                options={{title: null, headerShown: false}}
              />
              <Stack.Screen
                name="Register"
                component={Register}
                options={{title: null, headerShown: false}}
              />
              <Stack.Screen
                name="ChangePassword"
                component={ChangePassword}
                options={{title: null, headerShown: false}}
              />
            </>
          ) : (
            <Stack.Screen
              name="Login"
              component={Login}
              options={{title: null, headerShown: false}}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
