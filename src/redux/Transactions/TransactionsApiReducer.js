import { ACTION_TYPES } from './Action';

const initialState = {
  loading: false,
  data: [],
  error: '',
  currentPage: 1,
  lastPage:0
};

const transactionsApiReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.API_PENDING:
      return {
        ...state,
        loading: true,
      };
    case ACTION_TYPES.API_SUCCESS:
      return {
        ...state,
        data: action.payload.current_page==1?action.payload.data:[...state.data, ...action.payload.data],
        loading: false,
        currentPage: action.payload.current_page,
        lastPage: action.payload.last_page
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

export default transactionsApiReducer;