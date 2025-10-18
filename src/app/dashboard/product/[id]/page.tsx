"use client";

import { useParams, useRouter } from "next/navigation";

import {
  useDeleteProductMutation,
  useGetProductQuery,
} from "@/redux/features/productSlice";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Card } from "antd";
import Meta from "antd/es/card/Meta";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useGetProductQuery(id);
  const [deleteProduct] = useDeleteProductMutation();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteProduct(product?.id as string).unwrap();
      toast.success("Product deleted successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="flex flex-col items-center justify-center">
      <Card
        hoverable
        style={{ width: 540 }}
        cover={
          <Image
            src={product.images[0]}
            alt={product.name}
            className="w-full h-40 object-cover rounded mb-2"
            width={400}
            height={300}
          />
        }
      >
        <Meta title={product.name} description={`$${product.price}`} />

        <p className="text-secondary my-2">Category: {product.category.name}</p>

        {product.description && (
          <p className="text-gray-700 mb-4">{product.description}</p>
        )}
        <div className="flex justify-end space-x-3">
          <Link
            href={`/dashboard/product/edit/${product.slug}`}
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
      </Card>

      {confirming && (
        <div className="fixed inset-0 flex items-center justify-center bg-background bg-opacity-20">
          <div className="bg-light p-6 rounded-xl shadow-md">
            <p className="mb-4">
              Are you sure you want to delete this product?
            </p>
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
