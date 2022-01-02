import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert, Image, ScrollView, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import apiCallO from '../redux/Orders/ApiActionCreator';
import apiCallT from '../redux/Transactions/ApiActionCreator';
import apiCallOF from '../redux/Offers/ApiActionCreator';
import { baseUrl } from '../BaseUrl'
import { OrderContent } from './OrdersScene'
import { TransactionsContent } from './TransactionsScene'
import { OffersContent } from './OffersScene'
import Swiper from 'react-native-swiper'
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const orderData = useSelector((state) => state.ordersApiReducer.data)
  const orderList = useSelector((state) => state.ordersApiReducer.orderList)
  const transactionsData = useSelector((state) => state.transactionsApiReducer.data);
  //const offersData = useSelector((state) => state.offersApiReducer.data);
  const [offersData, setOffersData] = useState([]);
  const loading = useSelector((state) => state.ordersApiReducer.loading);
  const userData = useSelector((state) => state.loginApiReducer.userData);
  const [modalVisible, setModalVisible] = useState(false)
  const [points, setPoints] = useState("")
  const [redemptionType, setRedemptionType] = useState(1)
  //const [orderData, setOrderData] = useState({})

  useEffect(() => {
    dispatch(apiCallO(userData.token, 1))
    dispatch(apiCallT(userData.token, 1))
    //dispatch(apiCallOF(userData.token))
    getOffers()
    getWhatsAppNumber()
  }, [])

  const onRefresh = () => {
    dispatch(apiCallO(userData.token, 1))
    dispatch(apiCallT(userData.token, 1))
    //dispatch(apiCallOF(userData.token))
    getOffers()
  }

   const getWhatsAppNumber = () => {
      fetch(baseUrl + "whatsapp-chat-number", {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization : 'Bearer ' + userData.token
        }
        })
        .then((res) => res.json().then((data) => ({ status: res.status, body: data })))
        .then(async(json) => {
          console.log(JSON.stringify(json))
          if (json.status == 200) {
             try {
              await AsyncStorage.setItem('whatsappNumber', json.body.whatsapp_number)
             } catch (e) {
              console.log(e)
            }
          }
        })
        .catch((error) => {
            console.log(error);
        });
  }

  const onRedeem = () => {
    if (!points || points.trim() == "") {
      return
    }
    if (orderData.available_points < 100000) {
      return alert("You should have minimum 100,000 Points")
    }
    if (points % 100000 != 0) {
      return alert("Enter multiple of 100,000")
    }
    let formData = new FormData()
    formData.append("amount", points)
    formData.append("payout_type", redemptionType)
    fetch(baseUrl + "payouts", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + userData.token
      },
      body: formData
    })
      .then((res) => res.json().then((data) => ({ status: res.status, body: data })))
      .then((json) => {
        if (json.status == 200) {
          // setStageList(json.body.data)
          Alert.alert(
            json.body.message,
            "",
            [
              { text: "OK", onPress: () => { setModalVisible(false); setPoints(""); dispatch(apiCallT(userData.token)) } }
            ]
          );
        } else {
          if (json.body.message) {
            alert(json.body.message)
          } else {
            alert(json.body.error)
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const getOffers = () => {
   fetch(baseUrl + "banners", {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			Authorization : 'Bearer ' + userData.token
		}
	  })
    .then((res) => res.json().then((data) => ({ status: res.status, body: data })))
	  .then((json) => {
		  console.log(JSON.stringify(json))
      if (json.status == 200) {
        setOffersData(json.body.data)
        // json.body.data.map((item) => {
        //   setOffersData([...offersData, {url:item.image_full_path}])
        // })
		  }
     })
     .catch((error) => {
        console.log(error);
     });
  }

  const noItemDisplay = () => {
    return (
      <View style={{ height: 100, justifyContent: "center", alignItems: "center" }}>
        <Text style={{fontSize:15}}>No Data Available</Text>
      </View>  
    );
  }


  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
          <ScrollView style={{ flexGrow: 1 }}  refreshControl={
                                                <RefreshControl
                                                  refreshing={loading}
                                                  onRefresh={onRefresh}
                                                />
                                              }>
            <View style={styles.buttonContainer}>
              <View style={{}}>
                <Text style={{ fontSize: 20, color: "black" }}>Your Points</Text>
                <View style={{flexDirection:"row", marginTop:10}}>
                <Image style={{ width: 25, height: 25, marginTop:5 }} source={require('../images/rewards.png')} />
                <Text style={{ fontSize: 22, fontWeight: "bold",  color:"black", paddingLeft:5 }}>{orderData?.available_points?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </View> 
              </View>
             <View style={{}}>
               <Text style={{ fontSize: 20, color: "black" }}>Monetary Value</Text>
               <Text style={{ fontSize: 22, fontWeight: "bold", color:"black", paddingLeft:5, marginTop:10, textAlign:"right" }}>₹ {orderData?.available_reward_amount?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
             </View>
            </View> 
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={()=>setModalVisible(true)} style={styles.button}>
                <Text style={styles.buttonText}>Convert Points</Text> 
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>navigation.navigate("AddReferral")} style={styles.button}>
                <Text style={styles.buttonText}>Add Referral</Text> 
              </TouchableOpacity>
            </View>

          <View style={{backgroundColor:"#fff", margin:10, elevation:5, marginTop:20}}>

              <Swiper style={{height:200}} showsButtons={offersData.length>1?true:false}>
                {offersData.map((item, index) => {
                  return (
                    <TouchableOpacity key={index}
                                      onPress={() => navigation.navigate("ImagePreview", { image: item.image_full_path })}
                                      style={{  }}>
                    <Image style={{ width: "100%", height:"100%", resizeMode:"stretch" }} source={{uri:item.image_full_path}} />
                   </TouchableOpacity>
                  ) 
                 })
                }
              </Swiper>
          </View>
          {/* <View style={{backgroundColor:"#fff", margin:10, elevation:5, marginTop:20}}>
            <View style={{ flexDirection:"row", justifyContent:"space-between", width:"90%", alignSelf:"center"}}>
              <Text style={{ fontSize: 15, color: "#00BFFF", marginTop: 15 }}>Offers</Text>
              <TouchableOpacity onPress={()=>navigation.navigate("OffersScene")}>
               <Text style={{ fontSize: 15, color: "#00BFFF", marginTop: 15, textDecorationLine: "underline" }}>See All</Text>
              </TouchableOpacity>
            </View>    
          <FlatList
            data={offersData?.slice(0, 2)}
            renderItem={({item})=>OffersContent(item, navigation)}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={noItemDisplay}    
            />
          </View>   */}

          <View style={{backgroundColor:"#fff", margin:10, elevation:5, marginTop:20}}>
            <View style={{ flexDirection:"row", justifyContent:"space-between", width:"90%", alignSelf:"center"}}>
              <Text style={{ fontSize: 15, color: "#00BFFF", marginTop: 15 }}>Orders</Text>
              <TouchableOpacity onPress={()=>navigation.navigate("OrdersScene")}>
               <Text style={{ fontSize: 15, color: "#00BFFF", marginTop: 15, textDecorationLine: "underline" }}>See All</Text>
              </TouchableOpacity>
            </View>    
            <FlatList
              data={orderList?.slice(0, 2)}
              renderItem={({item})=>OrderContent(item)}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={noItemDisplay}     
            />
          </View>
            
          <View style={{backgroundColor:"#fff", margin:10, elevation:5, marginTop:20}}>
            <View style={{ flexDirection:"row", justifyContent:"space-between", width:"90%", alignSelf:"center"}}>
              <Text style={{ fontSize: 15, color: "#00BFFF", marginTop: 15 }}>Transactions</Text>
              <TouchableOpacity onPress={()=>navigation.navigate("TransactionsScene")}>
               <Text style={{ fontSize: 15, color: "#00BFFF", marginTop: 15, textDecorationLine: "underline" }}>See All</Text>
              </TouchableOpacity>
            </View>    
          <FlatList
            data={transactionsData?.slice(0, 2)}
            renderItem={({item})=>TransactionsContent(item)}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={noItemDisplay}
          />
          </View>  
       </ScrollView>             
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{fontSize:12, color:"#000", textAlign:"center", paddingBottom:5}}>Enter the points you want to redeem in multiple of 1 lakh</Text>
            <TextInput
                placeholder="Enter Points"
                style={styles.textInput}
                returnKeyType="done"
                value={points}
                onChangeText={(text) => setPoints(text)}
                keyboardType="numeric"
            />

                <View style={{ borderWidth:1, width:"85%", alignSelf:"center", marginTop:10}}>		  
                  <Picker
                    selectedValue={redemptionType}
                    onValueChange={(itemValue, itemIndex) =>
                      setRedemptionType(itemValue)
                    }>
                      <Picker.Item label={"Cash"} value={1} />
                      <Picker.Item label={"Gift"} value={2} />
                  </Picker>	
                </View>

            <TouchableOpacity onPress={onRedeem} style={styles.modalButtonContainer}>
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 12, color: "red", paddingTop: 5 }}>*You should have minimum 100,000 Points</Text>
            <TouchableOpacity onPress={() => { setModalVisible(false); setPoints("") }} style={{position:"absolute", right:10, top:10}}>
              <Image style={{width:20, height:20}}
                     source={ require('../images/close.png')}  />
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingTop:4
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    marginVertical:10
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

export default Dashboard;