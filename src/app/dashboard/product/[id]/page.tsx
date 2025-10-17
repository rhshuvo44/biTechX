"use client";

import { useParams, useRouter } from "next/navigation";

import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useDeleteProductMutation, useGetProductQuery } from "@/redux/features/productSlice";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useGetProductQuery(id);
  const [deleteProduct] = useDeleteProductMutation();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted successfully!");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-light rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-secondary mb-2">Category: {product.category.name}</p>
      <p className="text-accent mb-2 font-semibold">Price: ${product.price}</p>
      {product.description && (
        <p className="text-gray-700 mb-4">{product.description}</p>
      )}
      <div className="flex justify-end space-x-3">
        <Link
          href={`/products/edit/${product.id}`}
          className="bg-secondary text-light px-4 py-2 rounded hover:bg-accent transition"
        >
          Edit
        </Link>
        <button
          onClick={() => setConfirming(true)}
          className="bg-danger text-light px-4 py-2 rounded hover:opacity-80 transition"
        >
          Delete
        </button>
      </div>

      {confirming && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-light p-6 rounded-xl shadow-md">
            <p className="mb-4">Are you sure you want to delete this product?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirming(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-danger text-light px-4 py-2 rounded hover:opacity-80"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-center" />
    </div>
  );
}
