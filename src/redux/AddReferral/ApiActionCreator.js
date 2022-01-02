import {fetchData, fetchSuccess, fetchError} from './Action';
import { baseUrl } from '../../BaseUrl'
import { Alert } from 'react-native'
	
const apiActionCreator = (formdata, token, {onSuccess=()=>null}) => (dispatch) => {
  dispatch(fetchData());
  return new Promise(() => {
	  fetch(baseUrl + "leads", {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
			Authorization : 'Bearer ' + token

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
						{ text: "OK", onPress: () => console.log("OK Pressed") }
					]
				 );
              onSuccess()
			  dispatch(fetchSuccess(json.body));
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