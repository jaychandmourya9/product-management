import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchProducts as fetchProductsApi,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
} from '../services/productService'

// Initial state for product management.
const initialState = {
  items: [],
  status: 'idle',
  error: null,
  total: 0,
}

// Async thunk to load products from the API.
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const data = await fetchProductsApi()
  return data
})

// Async thunk to create a new product record.
export const addProduct = createAsyncThunk('products/addProduct', async (product) => {
  const data = await createProductApi(product)
  return data
})

// Async thunk to update an existing product by ID.
export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, changes }) => {
  const data = await updateProductApi(id, changes)
  return data
})

// Async thunk to delete a product by ID.
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
  await deleteProductApi(id)
  return id
})

// Product slice manages product state and handles async lifecycle actions.
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.products
        state.total = action.payload.total ?? action.payload.products.length
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
        state.total += 1
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((product) => product.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((product) => product.id !== action.payload)
        state.total = Math.max(0, state.total - 1)
      })
  },
})

export default productsSlice.reducer
