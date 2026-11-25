import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { demoProducts } from '../../data/demoProducts';

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params = {}) => {
    try {
      const { data } = await api.get('/products', { params });
      return data;
    } catch {
      // Demo catalogue keeps the storefront preview usable before the API is connected.
      const keyword = (params.keyword || '').toLowerCase();
      let products = demoProducts.filter((product) =>
        `${product.name} ${product.category}`.toLowerCase().includes(keyword)
      );
      if (params.sort === 'price') products = [...products].sort((a, b) => a.price - b.price);
      if (params.sort === '-price') products = [...products].sort((a, b) => b.price - a.price);
      const limit = Number(params.limit) || products.length;
      const page = Number(params.page) || 1;
      const start = (page - 1) * limit;
      return { products: products.slice(start, start + limit), totalProducts: products.length };
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (id) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.product;
    } catch {
      const demoProduct = demoProducts.find((product) => product._id === id);
      if (demoProduct) return demoProduct;
      throw new Error('Product not found');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: { products: [], totalProducts: 0, currentProduct: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.totalProducts = action.payload.totalProducts || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchProductById.pending, (state) => { state.loading = true; state.currentProduct = null; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.currentProduct = action.payload; })
      .addCase(fetchProductById.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default productSlice.reducer;
