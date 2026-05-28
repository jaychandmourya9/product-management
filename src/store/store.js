import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './productsSlice'

// Configure the Redux store with product slice reducer.
export const store = configureStore({
  reducer: {
    products: productsReducer,
  },
})
