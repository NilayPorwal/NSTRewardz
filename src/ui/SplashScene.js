import React, { useEffect } from 'react';
import { ImageBackground, Dimensions, View, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import { fetchSuccess } from '../redux/Login/Action';

export const {width, height} = Dimensions.get('screen');

const SplashScene = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
      getData()
  }, [])
	
	
const getData = async () => {
     try {
	  const jsonValue = await AsyncStorage.getItem('userData')
		 setTimeout(() => {
       if (jsonValue) {
        	  dispatch(fetchSuccess(JSON.parse(jsonValue)));
		    		return navigation.navigate("BottomStack")
			 }
          navigation.navigate("Login")
       }, 1500)
     } catch(e) {
		    console.log(e)
     }
}


  return (
	  <ImageBackground
		  source={require('../images/logo.png')}
		  style={{ flex: 1 }}
	      resizeMode="contain" >
      </ImageBackground>
   );
}

export default SplashScene;