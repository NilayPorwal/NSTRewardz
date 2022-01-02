import { ACTION_TYPES } from './Action';

const initialState = {
  loading: false,
  message: '',
  error: '',
};

const referralApiReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.API_PENDING:
      return {
        ...state,
        loading: true,
      };
    case ACTION_TYPES.API_SUCCESS:
      return {
        ...state,
        message: action.payload,
        loading: false,
      };
    case ACTION_TYPES.API_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default referralApiReducer;