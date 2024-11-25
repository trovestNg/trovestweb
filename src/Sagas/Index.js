import { configureStore } from '@reduxjs/toolkit'
import { adminReducer } from '../Reducers/admin.reducer'
import { agentReducer } from '../Reducers/agent.reducer'
import { superAdminReducer } from '../Reducers/super.admin.reducer'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { watcherSaga } from './root.saga'
import thunk from 'redux-thunk'


// mount it on the Store
const reducer = combineReducers({
    auth: adminReducer,
    agents: agentReducer,
    admins: superAdminReducer
})
const sagaMiddleware = createSagaMiddleware()

const middleware = [sagaMiddleware]
// const middleware = [thunk]
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// then run the saga
const store = createStore(reducer, {}, composeEnhancers(applyMiddleware(...middleware)))
// const store = configureStore(reducer, {}, composeEnhancers(applyMiddleware(...middleware)))
sagaMiddleware.run(watcherSaga)


export default store