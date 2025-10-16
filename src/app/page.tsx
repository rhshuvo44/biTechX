"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/redux/features/productSlice";
import Link from "next/link";
import { useState } from "react";
export default function Home() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetProductsQuery({ page: 1, search });
  const [deleteProduct] = useDeleteProductMutation();

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <input
            placeholder="Search..."
            className="border rounded px-3 py-2 w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link
            href="/products/create"
            className="bg-accent text-light px-4 py-2 rounded"
          >
            + Add Product
          </Link>
        </div>
        <div className="space-y-3">
          {data?.data?.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center bg-light border rounded p-4"
            >
              <div>
                <h2 className="font-semibold">{p.name}</h2>
                <p className="text-sm text-gray-600">{p.category}</p>
              </div>
              <div className="space-x-2">
                <Link href={`/products/${p.id}`} className="text-accent">
                  View
                </Link>
                <Link
                  href={`/products/edit/${p.id}`}
                  className="text-secondary"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="text-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
