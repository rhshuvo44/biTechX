"use client";

import ProductForm from "@/components/ui/ProductForm";
import { useGetProductQuery } from "@/redux/features/productSlice";
import { useParams } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useGetProductQuery(id);

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4 text-center">Edit Product</h1>
      <ProductForm
        id={id}
        mode="edit"
        defaultValues={{
          name: product.name,
          category: product.category.name,
          price: product.price,
          description: product.description,
          
        }}
      />
      <Toaster position="top-center" />
    </div>
  );
}
