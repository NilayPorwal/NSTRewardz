import React, { useEffect } from 'react';
import { ImageBackground, Dimensions } from 'react-native';

const AboutScene = ({ navigation }) => {

  return (
	  <ImageBackground
		  source={require('../images/logo.png')}
		  style={{ flex: 1 }}
	      resizeMode="contain" >
      </ImageBackground>
   );
}

export default AboutScene;