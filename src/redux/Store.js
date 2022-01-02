import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import loginApiReducer from './Login/LoginApiReducer';
import signupApiReducer from './Signup/SignupApiReducer';
import ordersApiReducer from './Orders/OrdersApiReducer';
import referralApiReducer from './AddReferral/ReferralApiReducer';
import transactionsApiReducer from './Transactions/TransactionsApiReducer';
import offersApiReducer from './Offers/OffersApiReducer';

const appReducers = combineReducers({
  loginApiReducer, ordersApiReducer, referralApiReducer, signupApiReducer, transactionsApiReducer, offersApiReducer
});

const rootReducer = (state, action) => appReducers(state, action);

const logger = createLogger();

export const store = createStore(rootReducer, applyMiddleware(thunk, logger));