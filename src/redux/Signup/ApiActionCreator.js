import {fetchData, fetchSuccess, fetchError} from './Action';
import { baseUrl } from '../../BaseUrl'
import { Alert } from 'react-native'
	
const apiActionCreator = (formdata, navigation) => (dispatch) => {
  dispatch(fetchData());
  return new Promise(() => {
	  fetch(baseUrl + "register", {
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
			  Alert.alert(
				  "Success!",
				  json.body.message,
					[
						{
							text: "OK",
							onPress: () => { navigation.goBack() },
						}
					]
				 );
			  dispatch(fetchSuccess(json.body.token));
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


export default apiActionCreator;