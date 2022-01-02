import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View, StyleSheet, Text, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import { baseUrl } from '../BaseUrl'
import ImagePicker from 'react-native-image-crop-picker';

const ProfileScene = ({ navigation }) => {
  const userData = useSelector((state) => state.loginApiReducer.userData);
  const [number, setNumber] = useState("")
  const [imageData, setImageData] = useState({path:userData?.user?.image_full_path})

  useEffect(() => {
    getWhatsAppNumber()
  }, [])
	
  const logOut = async () => {
     Alert.alert(
				  "Confirm!",
				  "do you want to logout ?",
          [
            { text: "No", onPress: () => console.log("OK Pressed") },
            {
              text: "Yes", onPress: async() => {
                 	await AsyncStorage.removeItem("userData")
	              	navigation.navigate("Login")
             }}
					]
				 );
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
	  .then((json) => {
		  console.log(JSON.stringify(json))
      if (json.status == 200) {
        setNumber(json.body.whatsapp_number)
		  }
     })
     .catch((error) => {
        console.log(error);
     });
  }


  const openPicker = () => {
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      cropping: true,
    }).then(image => {
      console.log(image);
      setImageData(image)
      uploadImage(image)
    });
  }

  const uploadImage = (image) => {
    const formData = new FormData()
    formData.append('image', {
      uri: image.path,
      type: image.mime,
      name: 'image.jpg',
    });
    
   fetch(baseUrl + "update-profile", {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization : 'Bearer ' + userData.token
     },
    body:formData
	  })
    .then((res) => res.json().then((data) => ({ status: res.status, body: data })))
	  .then((json) => {
		  console.log(JSON.stringify(json))
      if (json.status == 200) {
        userData.user = json.body.data
        const jsonValue = JSON.stringify(userData)
        AsyncStorage.setItem('userData', jsonValue)
        Alert.alert("Success!", "Profile updated successfully")
      }
      else {
          Alert.alert("Failed!", "Failed to update profile")

      }
     })
     .catch((error) => {
        console.log(error);
     });
  }

  return (
    <View style={styles.container}>
      <View style={{width: 120, height: 120, borderRadius:60, marginBottom: 20}}>
        {imageData.path ?
          <Image
            source={{uri:imageData.path }}
            style={{ width: "100%", height:"100%", borderRadius:60 }}
            resizeMode="contain" /> :
          <Image
            source={require('../images/profile.png')}
            style={{ width: "100%", height:"100%" }}
            resizeMode="contain" />}
        
         <TouchableOpacity onPress={openPicker} style={{position:"absolute", bottom:0, right:0}}>
          <Image
              source={require('../images/camera.png')}
              style={{ width: 40, height:40 }}
              resizeMode="contain" />
         </TouchableOpacity>   
      </View>
       
        <Text style={styles.text}>{userData.user.name}</Text>
        <Text style={styles.text}>{userData.user.phone}</Text>
        <Text style={styles.text}>{userData.user.city}, {userData.user.state}</Text>

      <TouchableOpacity onPress={logOut} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={() => Linking.openURL('whatsapp://send?phone='+number)}
                        style={{ position: "absolute", bottom: 15 }}>
        <Image
          source={require('../images/WhatsApp_icon.png')}
          style={{ width:50, height:50 }}
          resizeMode="contain" />
      </TouchableOpacity>     */}
	  </View>	  
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems:"center"
  },
  buttonContainer: {
    width: "85%",
    alignSelf: "center",
    marginTop: 15,
    backgroundColor: "#00BFFF",
    alignItems: "center",
    paddingVertical: 10,
    elevation:5
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  text: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold"
  }
})

export default ProfileScene;