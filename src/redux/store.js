import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import employerReducer from './slices/employer';
import adminReducer from './slices/adminSlice';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const userPersistConfig = {
    key: 'user',
    version: 1,
    storage
};

const employerPersistConfig = {
    key: 'employer',
    version: 1,
    storage
};

const adminPersistConfig = {
    key: 'admin',
    version: 1,
    storage
};


const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedEmployerReducer = persistReducer(employerPersistConfig, employerReducer);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);


const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        employer: persistedEmployerReducer,
        admin: persistedAdminReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            },
        }),
});

const persistor = persistStore(store);

export { store, persistor };
