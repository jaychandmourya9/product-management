import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../store/productsSlice'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

// Default values for the product add/edit form.
const initialForm = {
  title: '',
  description: '',
  price: '',
  brand: '',
  category: '',
  stock: '',
}

export default function ProductsPage() {
  // Redux state and local component state for products, form selection, pagination, and toasts.
  const dispatch = useDispatch()
  const { items, status, error, total } = useSelector((state) => state.products)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [toasts, setToasts] = useState([])
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: initialForm })

  // Load product list from the API once when the component is first displayed.
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts())
    }
  }, [dispatch, status])

  useEffect(() => {
    if (!selectedProduct) {
      reset(initialForm)
    }
  }, [selectedProduct, reset])

  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const pageItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [items, currentPage],
  )

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount)
    }
  }, [currentPage, pageCount])

  const heading = selectedProduct ? 'Update product' : 'Add new product'
  const buttonLabel = selectedProduct ? 'Save changes' : 'Create product'

  function handleEdit(product) {
    setSelectedProduct(product)
    reset({
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      brand: product.brand || '',
      category: product.category || '',
      stock: product.stock || '',
    })
  }

  function addToast(message, status = 'success') {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts((prev) => [...prev, { id, message, status }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3500)
  }

  // Submit the product form. If a product is selected, update it; otherwise create a new item.
  async function onSubmit(values) {
    try {
      if (selectedProduct) {
        await dispatch(updateProduct({ id: selectedProduct.id, changes: values })).unwrap()
        addToast('Product updated successfully.', 'success')
      } else {
        await dispatch(addProduct(values)).unwrap()
        addToast('New product created successfully.', 'success')
      }
      setSelectedProduct(null)
      reset(initialForm)
    } catch (dispatchError) {
      addToast(dispatchError?.message || 'Could not save the product. Please try again.', 'error')
    }
  }

  async function handleRemove(id) {
    try {
      await dispatch(deleteProduct(id)).unwrap()
      addToast('Product deleted.', 'success')
      if (selectedProduct?.id === id) {
        setSelectedProduct(null)
        reset(initialForm)
      }
      setDeleteCandidate(null)
    } catch (dispatchError) {
      addToast(dispatchError?.message || 'Could not delete the product. Please try again.', 'error')
    }
  }

  function openDeleteDialog(product) {
    setDeleteCandidate(product)
  }

  function cancelDelete() {
    setDeleteCandidate(null)
  }

  async function confirmDelete() {
    if (!deleteCandidate) return
    await handleRemove(deleteCandidate.id)
  }

  const productRows = useMemo(
    () =>
      pageItems.map((product) => (
        <tr key={product.id} className="border-b border-slate-800/70 last:border-b-0 hover:bg-slate-950/80">
          <td className="px-4 py-4 text-sm font-medium text-slate-100">{product.title}</td>
          <td className="px-4 py-4 text-sm text-slate-300">{product.brand}</td>
          <td className="px-4 py-4 text-sm text-slate-300">{product.category}</td>
          <td className="px-4 py-4 text-sm text-slate-300">${product.price}</td>
          <td className="px-4 py-4 text-sm text-slate-300">{product.stock}</td>
          <td className="flex flex-wrap gap-2 px-4 py-4">
            <button
              type="button"
              onClick={() => handleEdit(product)}
              className="cursor-pointer rounded-2xl bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => openDeleteDialog(product)}
              className="cursor-pointer rounded-2xl bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
            >
              Delete
            </button>
          </td>
        </tr>
      )),
    [pageItems],
  )

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:justify-end sm:pr-6">
          <div className="space-y-3 w-full max-w-xs">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`pointer-events-auto rounded-3xl border px-4 py-3 shadow-2xl shadow-black/20 transition ${toast.status === 'error' ? 'border-rose-500 bg-rose-500/10 text-rose-100' : 'border-emerald-500 bg-emerald-500/10 text-emerald-100'}`}
              >
                <p className="text-sm font-semibold">{toast.status === 'error' ? 'Oops!' : 'Success'}</p>
                <p className="mt-1 text-sm leading-6">{toast.message}</p>
              </div>
            ))}
          </div>
        </div>
        <header className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400/90">Products</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Product inventory list</h1>
              <p className="mt-3 max-w-2xl text-slate-400">
                Manage your product catalog with real-time CRUD operations using Redux and the DummyJSON products API.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 px-6 py-4 text-right text-slate-200 shadow-xl shadow-slate-950/10">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Total records</p>
              <p className="mt-2 text-3xl font-semibold text-white">{total}</p>
            </div>
          </div>
        </header>

        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Product list</h2>
                <p className="text-sm text-slate-400">Browse products fetched from the centralized store.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="cursor-pointer rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Go Dashboard
                </button>
                <span className="rounded-full bg-slate-950/70 px-4 py-2 text-sm text-slate-300">{status === 'loading' ? 'Loading...' : `${items.length} items`}</span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/70">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-slate-950/90 text-slate-400">
                  <tr>
                    <th className="px-4 py-4 font-medium">Title</th>
                    <th className="px-4 py-4 font-medium">Brand</th>
                    <th className="px-4 py-4 font-medium">Category</th>
                    <th className="px-4 py-4 font-medium">Price</th>
                    <th className="px-4 py-4 font-medium">Stock</th>
                    <th className="px-4 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>{productRows}</tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing <span className="font-semibold text-white">{pageItems.length}</span> of <span className="font-semibold text-white">{items.length}</span> products
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  First
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="cursor-pointer rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="px-3 py-2 text-sm text-slate-200">
                  Page {currentPage} of {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                  disabled={currentPage === pageCount}
                  className="cursor-pointer rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(pageCount)}
                  disabled={currentPage === pageCount}
                  className="cursor-pointer rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Last
                </button>
              </div>
            </div>

            {error && <p className="mt-6 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-500/20">{error}</p>}
          </div>

          <ConfirmDialog
            open={Boolean(deleteCandidate)}
            title="Delete this product?"
            description={
              deleteCandidate
                ? `Are you sure you want to delete ${deleteCandidate.title}? This action cannot be undone.`
                : ''
            }
            confirmText="Delete product"
            cancelText="Cancel"
            onCancel={cancelDelete}
            onConfirm={confirmDelete}
          />

          <aside className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">{heading}</h2>
              <p className="mt-2 text-sm text-slate-400">Use the form to add a new product or update an existing one.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-slate-300">Product name</label>
                <input
                  type="text"
                  {...register('title', { required: 'Product title is required' })}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                />
                {errors.title && <p className="mt-1 text-sm text-rose-400">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Description</label>
                <textarea
                  rows="3"
                  {...register('description', { required: 'Description is required' })}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                />
                {errors.description && <p className="mt-1 text-sm text-rose-400">{errors.description.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Price</span>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', {
                      required: 'Price is required',
                      min: { value: 0.01, message: 'Price must be greater than zero' },
                    })}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  {errors.price && <p className="text-sm text-rose-400">{errors.price.message}</p>}
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Stock</span>
                  <input
                    type="number"
                    {...register('stock', {
                      required: 'Stock is required',
                      min: { value: 0, message: 'Stock cannot be negative' },
                    })}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  {errors.stock && <p className="text-sm text-rose-400">{errors.stock.message}</p>}
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Brand</span>
                  <input
                    type="text"
                    {...register('brand', { required: 'Brand is required' })}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  {errors.brand && <p className="text-sm text-rose-400">{errors.brand.message}</p>}
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Category</span>
                  <input
                    type="text"
                    {...register('category', { required: 'Category is required' })}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  {errors.category && <p className="text-sm text-rose-400">{errors.category.message}</p>}
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting ? 'Saving…' : buttonLabel}
                </button>
                {selectedProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(null)
                      reset(initialForm)
                    }}
                    className="inline-flex w-full cursor-pointer items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/70 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white hover:text-white sm:w-auto"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </aside>
        </div>
      </section>
    </main>
  )
}
