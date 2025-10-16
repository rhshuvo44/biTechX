"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormType } from "@/lib/validation";
import { useCreateProductMutation, useUpdateProductMutation } from "@/redux/features/productSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ProductFormProps {
  defaultValues?: ProductFormType;
  id?: string;
  mode?: "create" | "edit";
}

export default function ProductForm({ defaultValues, id, mode = "create" }: ProductFormProps) {
  const router = useRouter();
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormType>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProductFormType) => {
    try {
      if (mode === "create") {
        await createProduct(data).unwrap();
        toast.success("Product created successfully!");
      } else if (id) {
        await updateProduct({ id, data }).unwrap();
        toast.success("Product updated successfully!");
      }
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-light p-6 rounded-xl shadow-md space-y-4"
    >
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          {...register("name")}
          placeholder="Product name"
          className="border p-2 w-full rounded"
        />
        {errors.name && <p className="text-danger text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Category</label>
        <input
          {...register("category")}
          placeholder="Category"
          className="border p-2 w-full rounded"
        />
        {errors.category && <p className="text-danger text-sm">{errors.category.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Price</label>
        <input
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          placeholder="Price"
          className="border p-2 w-full rounded"
        />
        {errors.price && <p className="text-danger text-sm">{errors.price.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          {...register("description")}
          placeholder="Optional"
          className="border p-2 w-full rounded"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={creating || updating}
        className="bg-accent text-light px-4 py-2 rounded hover:bg-secondary transition w-full"
      >
        {mode === "create"
          ? creating
            ? "Creating..."
            : "Create Product"
          : updating
          ? "Updating..."
          : "Update Product"}
      </button>
    </form>
  );
}
