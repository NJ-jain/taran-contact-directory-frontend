import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer'; // Import the combined reducers

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Custom middleware to support asyncDispatch
const asyncDispatchMiddleware = storeAPI => next => action => {
    let syncActivityFinished = false;
    let actionQueue = [];

    function flushQueue() {
        actionQueue.forEach(a => storeAPI.dispatch(a)); // Flush the queue
        actionQueue = [];
    }

    function asyncDispatch(asyncAction) {
        actionQueue = actionQueue.concat([asyncAction]);
        if (syncActivityFinished) {
            flushQueue();
        }
    }

    const actionWithAsyncDispatch = Object.assign({}, action, { asyncDispatch });

    const result = next(actionWithAsyncDispatch);
    syncActivityFinished = true;
    flushQueue();
    return result;
};

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(asyncDispatchMiddleware),
});

export const persistor = persistStore(store);