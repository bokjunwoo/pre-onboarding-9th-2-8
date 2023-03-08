import productApi from '@/api/product';
import { IProduct, IProductReducer } from '@/interface/product';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IFilterState {
  minPrice: number;
  maxPrice: number;
}

interface IFilterStateAll extends IFilterState {
  spaceCategory: string;
}

export const getProducts = createAsyncThunk<IProduct[]>(
  'product/getProducts',
  productApi.getProducts,
);

export const getFilteredProductsPrice = createAsyncThunk(
  'product/getFilteredProductsPrice',
  async ({ minPrice, maxPrice }: IFilterState) => {
    const response = await productApi.getProducts();
    const filteredProducts = response.filter(
      (product: IProduct) =>
        Number(product.price) >= minPrice && Number(product.price) <= maxPrice,
    );
    return filteredProducts;
  },
);

export const getFilteredProductsSpaceCategory = createAsyncThunk(
  'product/getFilteredProductsSpaceCategory',
  async (spaceCategory: string) => {
    const response = await productApi.getProducts();
    const filteredProducts = response.filter(
      (product: IProduct) => product.spaceCategory === spaceCategory,
    );
    return filteredProducts;
  },
);

export const getFilteredProductsAll = createAsyncThunk(
  'product/getFilteredProductsAll',
  async ({ minPrice, maxPrice, spaceCategory }: IFilterStateAll) => {
    const response = await productApi.getProducts();
    const filteredProducts = response.filter((product: IProduct) => {
      const isSpaceCategoryMatched =
        !spaceCategory || product.spaceCategory === spaceCategory;
      const isPriceMatched =
        (!minPrice || Number(product.price) >= minPrice) &&
        (!maxPrice || Number(product.price) <= maxPrice);
      return isSpaceCategoryMatched && isPriceMatched;
    });
    return filteredProducts;
  },
);

const initialState: IProductReducer = {
  isLoading: true,
  error: null,
  products: [],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.products = action.payload;
    });
    builder.addCase(getProducts.rejected, (state) => {
      state.isLoading = false;
      state.error = '상품 목록을 가져올 수 없습니다.';
    });
    builder.addCase(getFilteredProductsPrice.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getFilteredProductsPrice.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error =
        action.payload.length === 0 ? '검색 결과가 없습니다.' : null;
      state.products = action.payload;
    });
    builder.addCase(getFilteredProductsPrice.rejected, (state) => {
      state.isLoading = false;
      state.error = '찾은 목록을 가져올 수 없습니다.';
      state.products = [];
    });
    builder.addCase(getFilteredProductsSpaceCategory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      getFilteredProductsSpaceCategory.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload.length === 0 ? '검색 결과가 없습니다.' : null;
        state.products = action.payload;
      },
    );
    builder.addCase(getFilteredProductsSpaceCategory.rejected, (state) => {
      state.isLoading = false;
      state.error = '찾은 목록을 가져올 수 없습니다.';
      state.products = [];
    });
    builder.addCase(getFilteredProductsAll.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      getFilteredProductsAll.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload.length === 0 ? '검색 결과가 없습니다.' : null;
        state.products = action.payload;
      },
    );
    builder.addCase(getFilteredProductsAll.rejected, (state) => {
      state.isLoading = false;
      state.error = '찾은 목록을 가져올 수 없습니다.';
      state.products = [];
    });
  },
});

export default productSlice.reducer;
