import { ACTION_TYPES } from './Action';

const initialState = {
  loading: false,
  data: '',
  error: '',
  currentPage: 1,
  lastPage: 0,
  orderList:[]
};

const ordersApiReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.API_PENDING:
      return {
        ...state,
        loading: true,
      };
    case ACTION_TYPES.API_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
        orderList: action.payload.orders.current_page == 1 ?action.payload.orders.data:[...state.orderList, ...action.payload.orders.data],
        currentPage: action.payload.orders.current_page,
        lastPage: action.payload.orders.last_page
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

export default ordersApiReducer;