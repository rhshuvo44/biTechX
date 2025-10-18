import type { Category, Product } from "@/types/product";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.bitechx.com/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Product", "categories"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => {
        return `/products`;
      },
      // providesTags: ["Product"],
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }: { id: string }) => ({ type: "Product" as const, id })),
            { type: "Product", id: "LIST" },
          ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProduct: builder.query<Product, string>({
      query: (slugOrId) => `/products/${slugOrId}`,
      providesTags: ["Product"],
    }),

    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<Product, { id: string; data: Partial<Product> }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      // invalidatesTags: ["Product"],
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    getCategories: builder.query({
      query: () => {
        return `/categories`;
      },
      providesTags: ["categories"],
    }),

    getCategory: builder.query<Category, string>({
      query: (id) => `/categories/${id}`,
      providesTags: ["categories"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
} = productApi;
