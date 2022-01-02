import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList, ActivityIndicator, BackHandler, Image} from 'react-native';


const ImagePreview = ({navigation, route}) => {
    return (
	 <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
        <Image style={{ width: "90%", height: "80%", resizeMode:"contain" }} source={{uri:route.params.image}} />
      </View> 
    )
}

export default ImagePreview;