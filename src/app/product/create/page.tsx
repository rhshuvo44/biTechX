import ProductForm from '@/components/ui/ProductForm';
import React from 'react';
import { Toaster } from 'react-hot-toast';

const CreatePage = () => {
    return (
        <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4 text-center">Create New Product</h1>
      <ProductForm mode="create" />
      <Toaster position="top-center" />
    </div>
    );
};

export default CreatePage;