import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, ActivityIndicator, TouchableOpacity, ScrollView, BackHandler} from 'react-native'
import {useDispatch, useSelector} from 'react-redux';
import apiCall from '../redux/Signup/ApiActionCreator';
import { mobileValidator, passwordValidator, emailValidator, nameValidator } from '../Validators'
import FloatLabelTextInput from 'react-native-floating-label-text-input';

const SignUp = ({ navigation }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.signupApiReducer.loading);
  const error = useSelector((state) => state.signupApiReducer.error);
  const [name, setName] = useState({ value: '', error: '' })
  const [mobile, setMobile] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [address, setAddress] = useState({ value: '', error: '' })
  const [city, setCity] = useState({ value: '', error: '' })
  const [state, setState] = useState({ value: '', error: '' })

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

  const onSignUpPressed = () => {
    const mobileError = mobileValidator(mobile.value)
  	const passwordError = passwordValidator(password.value)
	  const emailError = emailValidator(email.value)
    const nameError = nameValidator(name.value)

    if (mobileError || passwordError || emailError) {
      setMobile({ ...mobile, error: mobileError })
      setPassword({ ...password, error: passwordError })
      setEmail({ ...email, error: emailError })
      setName({ ...name, error:nameError })
      return
    }
    let formData = new FormData()
    formData.append('phone', mobile.value)
	  formData.append('passcode', password.value)
	  formData.append('name', name.value)
    formData.append('email', email.value)
    formData.append('address', address.value)
    formData.append('city', city.value)
    formData.append('state', state.value)

    dispatch(apiCall(formData, navigation))
      //navigation.navigate("Dashboard")
  }
	
   const emptyForm = () => {
		setName({ value: '', error: '' })
		setMobile({ value: '', error: '' })
		setEmail({ value: '', error: '' })
		setAddress({ value: '', error: '' })
		setCity({ value: '', error: '' })
		setState({ value: '', error: '' })
		setPassword({ value: '', error: '' })
	}
  
  return loading ? (
	   <View style={styles.container}>
        <ActivityIndicator size="large" color="red" />
     </View>
	  ):(
	  <ScrollView contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">

      <View style={styles.textInput}>  
       <FloatLabelTextInput
          placeholder="Name*"
          returnKeyType="next"
          value={name.value}
		      onChangeTextValue={(text) => setName({ value: text, error: '' })}
		      autoFocus
       />	
      </View>		  
      {name.error ? <Text style={styles.error}>{name.error}</Text> : null}
      
      <View style={styles.textInput}>
        <FloatLabelTextInput
            placeholder="Email*"
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
      </View>
      {mobile.error ? <Text style={styles.error}>{mobile.error}</Text> : null}
      
     <View style={styles.textInput}>
       <FloatLabelTextInput
          placeholder="Enter 6 digit Passcode*"
          style={styles.textInput}
		      value={password.value}
		      returnKeyType="next"
          onChangeTextValue={(text) => setPassword({ value: text, error: '' })}
          //secureTextEntry
          maxLength={6}
          keyboardType="numeric"
       />
      </View> 
		  {password.error ? <Text style={styles.error}>{password.error}</Text> : null}
   
    <View style={styles.textInput}>
    	<FloatLabelTextInput
        placeholder="Address*"
        returnKeyType="next"
        value={address.value}
        onChangeTextValue={(text) => setAddress({ value: text, error: '' })}
      />
	   </View> 
     
      <View style={styles.textInput}>
        <FloatLabelTextInput
          placeholder="City*"
          returnKeyType="next"
          value={city.value}
          onChangeTextValue={(text) => setCity({ value: text, error: '' })}
        />
      </View>
     
      <View style={styles.textInput}>
	     <FloatLabelTextInput
          placeholder="State*"
          returnKeyType="done"
          value={state.value}
		      onChangeTextValue={(text) => setState({ value: text, error: '' })}
		      returnKeyType="done"
       />
      </View>
      
      <TouchableOpacity onPress={onSignUpPressed} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
     </ScrollView> 
  );
};

const styles = StyleSheet.create({
  container: {
  	flexGrow: 1,
  	paddingTop:20,
    backgroundColor:"#ffffff"
  },
  textInput: {
    //height: 40,
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
    marginTop: 15,
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

export default SignUp;
