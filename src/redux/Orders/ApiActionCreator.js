import {fetchData, fetchSuccess, fetchError} from './Action';
import { baseUrl } from '../../BaseUrl'

const apiActionCreator = (token, page) => (dispatch) => {
  dispatch(fetchData());
  return new Promise(() => {
	  fetch(baseUrl + "orders?page="+page, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			Authorization : 'Bearer ' + token
		}
	  })
      .then((res) => res.json().then((data) => ({ status: res.status, body: data })))
	  .then((json) => {
		  if (json.status == 200) {
			  dispatch(fetchSuccess(json.body.data));
		  } else {
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