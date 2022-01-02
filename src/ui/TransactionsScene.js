import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList, ActivityIndicator, BackHandler, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import apiCallT from '../redux/Transactions/ApiActionCreator';


export const TransactionsContent = (item) => {
    return (
      <View style={styles.orderContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop:5}}>
          <View style={{flexDirection:"row"}}>
            <Image style={{ width: 20, height: 20 }} source={require('../images/rewards.png')} />
            <Text style={styles.text}>{item?.points?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
            {item.payout_type == 1 && <Text style={styles.text}>(Cash)</Text>}
            {item.payout_type == 2 && <Text style={styles.text}>(Gift)</Text>}
          </View>
          <Text style={{ ...styles.text, fontSize: 12, textDecorationLine: "underline" }}>{item?.updated_at?.split(" ")[0]}</Text>
        </View>
         <Text style={{color: "black", fontSize: 15, paddingTop:10}}>Available Points : {item?.available_points?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
         <View style={{marginTop:5}}>
          {item.type == 1 && <Text style={{fontSize:15, color:"#00BFFF", fontWeight:"bold"}}>Status : Received</Text>}
          {item.type == 2 && <Text style={{fontSize:15, color:"red", fontWeight:"bold"}}>Status : Lost</Text>}
          {item.type == 3 && item.payout_status == "pending" && <Text style={{fontSize:15, color:"#FFA500", fontWeight:"bold"}}>Status : Redemption Request Pending</Text>}
          {item.type == 3 && item.payout_status == "accepted" && <Text style={{fontSize:15, color:"green", fontWeight:"bold"}}>Status : Redemption Request Accepted</Text>}
        </View>
      </View> 
    )
  }

export const TransactionsScene = ({navigation}) => {
  const dispatch = useDispatch();
  const transactionsData = useSelector((state) => state.transactionsApiReducer.data);
  const loading = useSelector((state) => state.transactionsApiReducer.loading);
  const userData = useSelector((state) => state.loginApiReducer.userData);
  const currentPage = useSelector((state) => state.transactionsApiReducer.currentPage);
  const lastPage = useSelector((state) => state.transactionsApiReducer.lastPage);

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
      dispatch(apiCallT(userData.token, pageNo))
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
          <FlatList
            data={transactionsData}
            renderItem={({item})=>TransactionsContent(item)}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0}
            onEndReached={LoadMoreData}
            ListFooterComponent={renderFooter}

          />
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
