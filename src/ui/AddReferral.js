import React, { useState, useEffect } from 'react';
import {
  View, TextInput, StyleSheet, Text, ActivityIndicator, Image,
  TouchableOpacity, ScrollView, Keyboard, ActionSheetIOS, Platform, PermissionsAndroid
} from 'react-native'
import {useDispatch, useSelector} from 'react-redux';
import apiCall from '../redux/AddReferral/ApiActionCreator';
import { mobileValidator, nameValidator, addressValidator, stageValidator } from '../Validators'
import {Picker} from '@react-native-picker/picker';
import { baseUrl } from '../BaseUrl'
import FloatLabelTextInput from 'react-native-floating-label-text-input';

const AddReferral = ({ navigation }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.referralApiReducer.loading);
  const userData = useSelector((state) => state.loginApiReducer.userData);
  const [name, setName] = useState({ value: '', error: '' })
  const [mobile, setMobile] = useState({ value: '', error: '' })
  const [pincode, setPincode] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [address, setAddress] = useState({ value: '', error: '' })
  const [city, setCity] = useState({ value: '', error: '' })
  const [state, setState] = useState({ value: '', error: '' })
  const [description, setDescription] = useState({ value: '', error: '' })
  const [stage, setStage] = useState({ value: -1, error: '' })
  const [stageList, setStageList] = useState([])
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [stageListIOS, setStageListIOS] = useState([])

  useEffect(() => {
    fetch(baseUrl + "lead-stages", {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + userData.token
      }
    })
      .then((res) => res.json().then((data) => ({ status: res.status, body: data })))
      .then((json) => {
        console.log(JSON.stringify(json))
        if (json.status == 200) {
          setStageList(json.body.data)
          json.body.data.forEach((item) => {
             setStageListIOS((stages)=>[...stages, item.name])
          })         
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])
  

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const phoneBookPress = () => {
     PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        'title': 'Contacts',
        'message': 'This app would like to view your contacts.',
        'buttonPositive': 'Please accept bare mortal'
      }
    )
    .then(() => {
      navigation.navigate('SelectContact', {
        onReturn: (res) => {setMobile({ value: res, error: '' })}
      })
    })
  }

  const onSubmit = () => {   
    const mobileError = mobileValidator(mobile.value)
    const nameError = nameValidator(name.value)
    const addressError = addressValidator(address.value)
    const stageError = stageValidator(stage.value)

    if (mobileError || nameError || addressError || stageError) {
      setMobile({ ...mobile, error: mobileError })
      setAddress({ ...address, error: addressError })
      setName({ ...name, error: nameError })
      setStage({ ...stage, error: stageError })
      return
    }
    let formData = new FormData()
    formData.append('mobile', mobile.value)
    formData.append('pincode', pincode.value)
    formData.append('name', name.value)
    formData.append('email', email.value)
    formData.append('address', address.value)
    formData.append('city', city.value)
    formData.append('state', state.value)
    formData.append('requirement_description', description.value)
    formData.append('stage_id', stage.value)
    dispatch(apiCall(formData, userData.token, { onSuccess: () => emptyForm() }))
  }
	
  const emptyForm = () => {
    setName({ value: '', error: '' })
    setMobile({ value: '', error: '' })
    setEmail({ value: '', error: '' })
    setAddress({ value: '', error: '' })
    setCity({ value: '', error: '' })
    setPincode({ value: '', error: '' })
    setState({ value: '', error: '' })
    setDescription({ value: '', error: '' })
    setStage({ value: -1, error: '' })

  }

   const openStagePicker = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", ...stageListIOS],
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex != 0) {
           setStage({ value: stageList[buttonIndex-1].id, error: '' })
        }
      }
    );
  
  
  return loading ? (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="red" />
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
       
      <View style={styles.textInput}>
        <FloatLabelTextInput
          placeholder="Name*"
          returnKeyType="next"
          value={name.value}
          onChangeTextValue={(text) => setName({ value: text, error: '' })}
        />
      </View>
      {name.error ? <Text style={styles.error}>{name.error}</Text> : null}
    
      <View style={styles.textInput}>
        <FloatLabelTextInput
          placeholder="Email"
          returnKeyType="next"
          value={email.value}
          onChangeTextValue={(text) => setEmail({ value: text, error: '' })}
          keyboardType="email-address"
        />
      </View>
      {email.error ? <Text style={styles.error}>{email.error}</Text> : null}

      <View style={styles.textInput}>
        <FloatLabelTextInput
          placeholder="Mobile Number*"
          returnKeyType="next"
          value={mobile.value}
          onChangeTextValue={(text) => setMobile({ value: text, error: '' })}
          keyboardType="numeric"
          maxLength={10}
          />
          <TouchableOpacity onPress={()=>phoneBookPress()} style={{position:"absolute", right:10, top:12}}>
          <Image style={{ width: 20, height: 20, tintColor:'green' }} source={require('../images/phonebook.png')} />
        </TouchableOpacity>
      </View>
        {mobile.error ? <Text style={styles.error}>{mobile.error}</Text> : null}
              
      <View style={styles.textInput}>
        <FloatLabelTextInput
          placeholder="Address*"
          returnKeyType="next"
          value={address.value}
          onChangeTextValue={(text) => setAddress({ value: text, error: '' })}
        />
        </View>
        {address.error ? <Text style={styles.error}>{address.error}</Text> : null}

      <View style={styles.textInput}>
        <FloatLabelTextInput
          placeholder="City"
          returnKeyType="next"
          value={city.value}
          onChangeTextValue={(text) => setCity({ value: text, error: '' })}
        />
      </View>
      {/* <View style={styles.textInput}>
        <FloatLabelTextInput
          placeholder="State"
          returnKeyType="done"
          value={state.value}
          onChangeTextValue={(text) => setState({ value: text, error: '' })}
          returnKeyType="next"
        />
      </View>
      <View style={styles.textInput}>
        <FloatLabelTextInput
          placeholder="Pin Code"
          value={pincode.value}
          returnKeyType="next"
          onChangeTextValue={(text) => setPincode({ value: text, error: '' })}
          maxLength={6}
          keyboardType="numeric"
        />
      </View> */}
      <View style={{ borderWidth: 1, width: "85%", alignSelf: "center", marginTop: 10 }}>
          {Platform.OS == 'android' ?
            <Picker
              selectedValue={stage.value}
              onValueChange={(itemValue, itemIndex) =>
                setStage({ value: itemValue, error: '' })
              }>
              <Picker.Item label={"--Select Stage*--"} value={-1} />
              {stageList.map((item, index) => {
                return (<Picker.Item label={item.name} value={item.id} key={index} />)
              })}
            </Picker> :
            <TouchableOpacity onPress={() => openStagePicker()}>
             {stage.value == -1 ?
                <Text style={{ padding: 10 }}>--Select Stage*--</Text>:
                <Text style={{ padding: 10 }}>{stageList.find((item)=>item.id == stage.value).name}</Text>}
            </TouchableOpacity>}
      </View>
      {stage.error ? <Text style={styles.error}>{stage.error}</Text> : null}
   
      <TextInput
        placeholder="Description"
        returnKeyType="done"
        value={description.value}
        onChangeText={(text) => setDescription({ value: text, error: '' })}
        multiline
        style={{ textAlignVertical: 'top', ...styles.textInput, height: 100 }}
      />

      <TouchableOpacity onPress={onSubmit} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {keyboardStatus&&
        <View style={{ height: 150 }}>
        </View>
      }    
     </ScrollView> 
  );
};

const styles = StyleSheet.create({
  container: {
	  flexGrow: 1,
	  paddingTop: 10,
	  backgroundColor: 'white',
    //justifyContent: "center"
  },
  textInput: {
   // height: 40,
    width: "85%",
    borderWidth: 1,
    alignSelf: "center",
    fontSize: 16,
	  paddingLeft: 5,
   	marginTop:10
  },
  error: {
    fontSize: 12,
    color: "red",
    paddingLeft:"8%"
  },
  buttonContainer: {
    width: "85%",
    alignSelf: "center",
    marginVertical: 15,
    backgroundColor: "#00BFFF",
    alignItems: "center",
    paddingVertical: 10,
    elevation:5
  },
  loginText: {
    fontSize: 25,
    color: "#00BFFF",
    textAlign: "center",
	  fontWeight: "bold",
    marginTop: 15
  },
  title: {
    color: "#000",
    fontSize: 15,
    marginTop: 15,
    paddingLeft: "10%"
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  }
})

export default AddReferral;
