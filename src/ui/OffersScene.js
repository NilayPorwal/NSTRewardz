import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList, ActivityIndicator, BackHandler, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import apiCall from '../redux/Orders/ApiActionCreator';
import { baseUrl } from '../BaseUrl'


export const OffersContent = (item, navigation) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("ImagePreview", {image:item.image_full_path})} style={styles.orderContainer}>
        <Image style={{ width: "100%", height: 150, resizeMode:"contain" }} source={{uri:item.image_full_path}} />
      </TouchableOpacity> 
    )
}

export const OffersScene = ({navigation}) => {
  const dispatch = useDispatch();
  const offersData = useSelector((state) => state.offersApiReducer.data);
  const loading = useSelector((state) => state.offersApiReducer.loading);
  const userData = useSelector((state) => state.loginApiReducer.userData);

   useEffect(() => {
    const backAction = () => {
      navigation.goBack()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);



  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
          <FlatList
            data={offersData}
            renderItem={({item})=>OffersContent(item, navigation)}
            keyExtractor={(item, index) => index.toString()}
            />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: "center"
  },
  orderContainer: {
    marginTop:15,
    borderBottomWidth:StyleSheet.hairlineWidth
  },
   text: {
    color: "black",
    fontSize: 15,
    paddingTop:4
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf:"center"
  },
  button: {
    width: "40%",
    backgroundColor: "#00BFFF",
    alignItems: "center",
    paddingVertical: 10,
    elevation:5
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#00000080"
  },
  modalView: {
    width:"85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textInput: {
    height: 40,
    width: "85%",
    borderWidth: 1,
    alignSelf: "center",
    fontSize: 16,
    paddingLeft:5
  },
  modalButtonContainer: {
    width: "85%",
    alignSelf: "center",
    marginTop: 15,
    backgroundColor: "#00BFFF",
    alignItems: "center",
    paddingVertical: 10,
    elevation:5
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  }
})
