import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScene from './ui/SplashScene'
import Login from './ui/Login'
import Dashboard from './ui/Dashboard'
import SignUp from './ui/SignUp'
import AddReferral from './ui/AddReferral'
import ProfileScene from './ui/ProfileScene'
import AboutScene from './ui/AboutScene'
import { SelectContact } from './ui/SelectContact'
import { OrdersScene } from './ui/OrdersScene'
import { TransactionsScene } from './ui/TransactionsScene'
import { OffersScene } from './ui/OffersScene'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Linking } from 'react-native';
import ImagePreview from './ui/ImagePreview'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SplashScene"
          component={SplashScene}
		      options={{ headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
		      options={{ headerShown: false}}
        />
         <Stack.Screen
          name="SignUp"
          component={SignUp}
		      options={{ title: "Sign Up"}}
        />
         <Stack.Screen
          name="BottomStack"
          component={BottomStack}
		      options={{ headerShown: false}}
        />
         <Stack.Screen
          name="OrdersScene"
          component={OrdersScene}
		      options={{ title: "Orders"}}
        />
         <Stack.Screen
          name="TransactionsScene"
          component={TransactionsScene}
		      options={{ title: "Transactions"}}
        />
         <Stack.Screen
          name="OffersScene"
          component={OffersScene}
		      options={{ title: "Offers"}}
        />
         <Stack.Screen
          name="ImagePreview"
          component={ImagePreview}
		      options={{ title: "Offer"}}
        />
        <Stack.Screen
          name="SelectContact"
          component={SelectContact}
		      options={{ title: "Select Contact"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const BottomStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={Dashboard}
        options={{
          tabBarActiveTintColor: "#00BFFF",
          tabBarInactiveTintColor:"#000000",
          title: 'Dashboard',
          headerRight: () => (
            <Image style={{ width: 50, height: 50, marginRight:15 }} source={require('./images/logo.png')} />),
          tabBarIcon: ({ focused }) => (
            <Image style={{ width: 30, height: 30, tintColor: focused ? "#00BFFF" : "#000" }} source={require('./images/home.png')} />)
        }} />
      <Tab.Screen name="AddReferral" component={AddReferral}
        options={{
          tabBarActiveTintColor: "#00BFFF",
          tabBarInactiveTintColor:"#000000",
          title: 'Add Referral',
          headerRight: () => (
            <Image style={{ width: 50, height: 50, marginRight:15 }} source={require('./images/logo.png')} />),
          tabBarIcon: ({ focused }) => (
            <Image style={{ width: 30, height: 30, tintColor: focused ? "#00BFFF" : "#000" }} source={require('./images/add.png')} />)
        }} />
       <Tab.Screen name="ProfileScene" component={ProfileScene}
        options={{
          tabBarActiveTintColor: "#00BFFF",
          tabBarInactiveTintColor:"#000000",
          title: 'Profile',
          headerRight: () => (
            <Image style={{ width: 50, height: 50, marginRight:15 }} source={require('./images/logo.png')} />),
          tabBarIcon: ({ focused }) => (
            <Image style={{ width: 30, height: 30, tintColor: focused ? "#00BFFF" : "#000" }} source={require('./images/profile.png')} />)
        }} />
      <Tab.Screen name="Contact" component={AboutScene}
         listeners={({ navigation, route }) => ({
           tabPress: async e => {
               const number = await AsyncStorage.getItem('whatsappNumber')
               Linking.openURL('whatsapp://send?phone='+number)
            },
          })}
          options={{
            tabBarActiveTintColor: "#00BFFF",
            tabBarInactiveTintColor:"#000000",
            title: 'Contact',
            headerRight: () => (
              <Image style={{ width: 50, height: 50, marginRight:15 }} source={require('./images/logo.png')} />),
            tabBarIcon: ({ focused }) => (
              <Image style={{ width: 30, height: 30 }} source={require('./images/WhatsApp_icon.png')} />)
         }} />
    </Tab.Navigator>
  );
}

export default Navigation;