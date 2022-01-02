import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList, ActivityIndicator, BackHandler, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import apiCallO from '../redux/Transactions/ApiActionCreator';


export const OrderContent = (item) => {
    return (
      <View style={styles.orderContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{flexDirection:"row"}}>
            <Image style={{ width: 20, height: 20 }} source={require('../images/user.png')} />
            <Text style={styles.text}>{item.name}</Text>
          </View>
          <Text style={{ ...styles.text, fontSize: 12 }}>Created at: <Text style={{ textDecorationLine: "underline" }}>{item.created_at.split(" ")[0]}</Text></Text>
        </View>

        <View style={{flexDirection:"row", marginTop:5}}>
          <Image style={{ width: 20, height: 20 }} source={require('../images/mobile.png')} />
          <Text style={styles.text}>{item.mobile}</Text>
        </View>
        
        <View style={{flexDirection:"row", marginTop:5}}>
          <Image style={{ width: 20, height: 20 }} source={require('../images/address.png')} />
          <Text style={styles.text}>{item.address}</Text>
        </View>
        
          <View style={{flexDirection:"row", marginTop:5}}>
            <Image style={{ width: 20, height: 20 }} source={require('../images/description.png')} />
            <Text style={styles.text}>{item.description}</Text>
          </View>  
        
         <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop:5}}>
          <View style={{flexDirection:"row"}}>
            <Image style={{ width: 20, height: 20 }} source={require('../images/rewards.png')} />
            <Text style={styles.text}>{item.points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
          </View>  
          <Text style={[styles.text, {fontWeight:"bold"}]}>₹ {item.amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
        </View>  
      </View> 
    )
  }

export const OrdersScene = ({navigation}) => {
  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.ordersApiReducer.orderList);
  const loading = useSelector((state) => state.ordersApiReducer.loading);
  const userData = useSelector((state) => state.loginApiReducer.userData);
  const currentPage = useSelector((state) => state.ordersApiReducer.currentPage);
  const lastPage = useSelector((state) => state.ordersApiReducer.lastPage);
  
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

const LoadMoreData = () => {
    if (currentPage != lastPage) {
      let pageNo = currentPage
      pageNo++
      dispatch(apiCallO(userData.token, pageNo))
    }
    
 }
  
 const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator
            size="large" color="red"
            style={{margin: 15}} />
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
          <FlatList
            data={orderList}
            renderItem={({item})=>OrderContent(item)}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0}
            onEndReached={LoadMoreData}
            ListFooterComponent={renderFooter}
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
    padding:15,
    borderBottomWidth:StyleSheet.hairlineWidth
  },
  text: {
    color: "black",
    fontSize: 15,
    paddingLeft:5
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
