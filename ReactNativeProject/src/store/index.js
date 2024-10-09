import { configureStore } from '@reduxjs/toolkit';
import cocktailReducer from './slices/cocktailSlice';

export default configureStore({
  reducer: {
    cocktails: cocktailReducer,
  },
});
