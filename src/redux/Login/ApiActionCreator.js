import {fetchData, fetchSuccess, fetchError} from './Action';
import { baseUrl } from '../../BaseUrl'
import AsyncStorage from '@react-native-async-storage/async-storage';
	
const apiActionCreator = (formdata, navigation) => (dispatch) => {
  dispatch(fetchData());
  return new Promise(() => {
	  fetch(baseUrl + "login", {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
		body:formdata
	  })
      .then((res) => res.json().then((data) => ({ status: res.status, body: data })))
	  .then((json) => {
		  console.log(JSON.stringify(json))
		  if (json.status == 200) {
			  storeData(json.body)
			  dispatch(fetchSuccess(json.body));
			  navigation.push("BottomStack")
		  } else {
			  if (json.body.message) {
				  alert(json.body.message)
			  } else {
				  alert(json.body.error)
			  }
			  dispatch(fetchError(json.body.error));
		  }
      })
      .catch((error) => {
        dispatch(fetchError(error));
        console.log(error);
      });
  });
};

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)  
    await AsyncStorage.setItem('userData', jsonValue)
  } catch (e) {
    console.log(e)
  }
}

export default apiActionCreator;