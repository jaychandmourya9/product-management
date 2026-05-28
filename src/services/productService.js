import axios from 'axios'

// Configure the shared Axios instance for DummyJSON API requests.
const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Fetch a list of products from DummyJSON.
// The response includes the product array and total count.
export async function fetchProducts() {
  const response = await api.get('/products?limit=100')
  return response.data
}

// Create a new product using the DummyJSON products add endpoint.
// Numeric values are explicitly converted so the API receives proper types.
export async function createProduct(product) {
  const response = await api.post('/products/add', {
    title: product.title,
    description: product.description,
    price: Number(product.price),
    brand: product.brand,
    category: product.category,
    stock: Number(product.stock),
  })
  return response.data
}

// Update an existing product by ID.
// The endpoint returns the updated product detail.
export async function updateProduct(id, changes) {
  const response = await api.put(`/products/${id}`, {
    title: changes.title,
    description: changes.description,
    price: Number(changes.price),
    brand: changes.brand,
    category: changes.category,
    stock: Number(changes.stock),
  })
  return response.data
}

// Delete a product by ID.
// No returned payload is required for this operation.
export async function deleteProduct(id) {
  await api.delete(`/products/${id}`)
}
