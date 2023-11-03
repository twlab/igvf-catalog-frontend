import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import searchReducer from "./slices/searchSlice";
import uiReducer from "./slices/uiSlice";
import settingsReducer from "./slices/settingsSlice";

const rootReducer = combineReducers({
  search: searchReducer,
  ui: uiReducer,
  settings: settingsReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
