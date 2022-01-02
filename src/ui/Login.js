import React, { useState, useEffect } from 'react';
import { View, TextInput, BackHandler, StyleSheet, Text, ActivityIndicator, TouchableOpacity, ScrollView, Alert} from 'react-native'
import {useDispatch, useSelector} from 'react-redux';
import apiCall from '../redux/Login/ApiActionCreator';
import { mobileValidator, passwordValidator } from '../Validators'
import FloatLabelTextInput from 'react-native-floating-label-text-input';

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loginApiReducer.loading);
  const error = useSelector((state) => state.loginApiReducer.error);
  const [mobile, setMobile] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const onLoginPressed = () => {
    const mobileError = mobileValidator(mobile.value)
    const passwordError = passwordValidator(password.value)
    if (mobileError || passwordError) {
      setMobile({ ...mobile, error: mobileError })
      setPassword({ ...password, error: passwordError })
      return
    }
    let formData = new FormData()
    formData.append('phone', mobile.value)
    formData.append('password', password.value)
    dispatch(apiCall(formData, navigation))
      //navigation.navigate("Dashboard")
  }

  useEffect(() => {
    const backAction = () => {
      // Alert.alert("Hold on!", "Are you sure you want to go back?", [
      //   {
      //     text: "Cancel",
      //     onPress: () => null,
      //     style: "cancel"
      //   },
      //   { text: "YES", onPress: () => BackHandler.exitApp() }
      // ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  
  return loading ? (
	   <View style={styles.container}>
        <ActivityIndicator size="large" color="red" />
     </View>
  ) : (
    <ScrollView contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled">
        <Text style={styles.loginText}>Login</Text>
        
      <View style={styles.textInput}>
       <FloatLabelTextInput
          placeholder="Enter Mobile Number*"
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
            returnKeyType="done"
            value={password.value}
            onChangeTextValue={(text) => setPassword({ value: text, error: '' })}
            //secureTextEntry
            maxLength={6}
            keyboardType="numeric"
        />
       </View>
       {password.error ? <Text style={styles.error}>{password.error}</Text> : null}

      <TouchableOpacity onPress={onLoginPressed} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
        <Text style={{color:"#000", fontSize:15, paddingVertical:15, textAlign:"center"}}>OR</Text>
        <Text style={{color:"#000", textAlign:"center"}}>Don't have an account ? </Text>        
        <TouchableOpacity onPress={()=>navigation.navigate("SignUp")} style={styles.buttonContainer}>
         <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
    </ScrollView>  
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor:"#ffffff"
  },
  textInput: {
    width: "85%",
    borderWidth: 1,
    alignSelf: "center",
    marginTop: 10,
    paddingLeft:5
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

export default Login;
