// "use client";

// import ProtectedRoute from "@/components/ProtectedRoute";
// import Link from "next/link";
// import { useState } from "react";

// import {
//   useDeleteProductMutation,
//   useGetProductsQuery,
// } from "@/redux/features/productSlice";
// import { Product } from "@/types/product";
// import Image from "next/image";
// import { useDebounce } from "@/hook/useDebounce";

// export default function ProductsPage() {
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");

//  const debouncedSearch = useDebounce(search, 300);

//   const { data:products, isLoading, error } = useGetProductsQuery({ page, search: debouncedSearch });

//   const [deleteProduct] = useDeleteProductMutation();
//   console.log(products);
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this product?")) return;
//     await deleteProduct(id); // RTK Query handles cache invalidation
//   };

//   return (
//     <ProtectedRoute>
//       <div className="p-6">
//         {/* Search & Create */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border p-2 rounded w-full md:w-1/3"
//           />
//           <Link
//             href="/products/create"
//             className="bg-[#4E6E5D] text-white px-4 py-2 rounded hover:bg-[#AD8A64]"
//           >
//             Create Product
//           </Link>
//         </div>

//         {/* Loading/Error */}
//         {isLoading && <p>Loading products...</p>}
//         {error && <p className="text-red-500">Failed to load products</p>}

//         {/* Products Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products?.map((product: Product) => (
//             <div
//               key={product.id}
//               className="border rounded p-4 shadow hover:shadow-lg transition relative"
//             >
//               <Image
//                 src={product.images[0]}
//                 alt={product.name}
//                 className="w-full h-40 object-cover rounded mb-2"
//                 width={400}
//                 height={160}
//               />
//               <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
//               {/* <p className="text-sm text-gray-600 mb-1">{product.category.name}</p> */}
//               <p className="text-md font-bold mb-2">${product.price}</p>

//               {/* Actions */}
//               <div className="flex justify-between">
//                 <Link
//                   href={`/products/${product.slug}`}
//                   className="text-blue-500 hover:underline"
//                 >
//                   Details
//                 </Link>
//                 <Link
//                   href={`/products/${product.slug}/edit`}
//                   className="text-green-500 hover:underline"
//                 >
//                   Edit
//                 </Link>
//                 <button
//                   onClick={() => handleDelete(product.id)}
//                   className="text-red-500 hover:underline"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center items-center space-x-4 mt-6">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage((prev) => prev - 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span>Page {page}</span>
//           <button
//             disabled={products?.length === 0 || products?.length < 10}
//             onClick={() => setPage((prev) => prev + 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }
"use client";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnType } from "antd";
import { Button, Image, Input, Modal, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

import { Product } from "@/types/product";
type DataIndex = keyof Product;

import ProtectedRoute from "@/components/ProtectedRoute";

import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/redux/features/productSlice";
import Link from "next/link";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const {
    data: products,
    isLoading,
    error,
  } = useGetProductsQuery({ page, search: "" });

  const [deleteProduct] = useDeleteProductMutation();
  console.log(products);
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await deleteProduct(id); // RTK Query handles cache invalidation
  };
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
    setSearchedColumn("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<Product> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            // onClick={() => clearFilters && handleReset(clearFilters)}
            onClick={() => {
              if (clearFilters) {
                handleReset(clearFilters);
              }
              setSelectedKeys([]);
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button> */}
          <Button
            type="link"
            size="small"
            onClick={() => {
              if (clearFilters) {
                handleReset(clearFilters);
              }
              setSelectedKeys([]);
              confirm();
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()) ?? false,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const colums = [
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (_: any, record: Product) => (
        <Image
          src={record?.images[0]}
          alt="Employee Photo"
          onClick={() => {
            setPreviewImage(record.images[0]);
            setPreviewOpen(true); // Open the modal when image is clicked
          }}
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },

    {
      title: "Category",
      key: "category",
      render: (item: Product) => {
        return <p>{item.category.name}</p>;
      },
    },

    {
      title: "Action",
      key: "action",
      render: (item: Product) => {
        return (
          <Space>
            <Link href={`/employee/${item.id}`}>Edit</Link>

            <Button danger onClick={() => handleDelete(item.id as string)}>
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <ProtectedRoute>
      <div className="px-20">
        <div className="flex flex-col lg:flex-row gap-1 items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Product List</h1>
          <div className="text-sm md:text-lg lg:text-3xl font-bold">
            <span className="text-red-500">
              <Button type="primary">Create Product</Button>
            </span>
          </div>
        </div>
        <div className="responsive-table-container">
          <Table
            size="small"
            className="table-auto"
            // style={{ tableLayout: "auto" }}
            bordered
            columns={colums}
            dataSource={products || []}
            rowKey="_id"
            // scroll={{ y: 55 * 7 }}
            // pagination={false}
          />
        </div>
        {previewOpen && (
          <Modal
            title="Product Photo"
            onCancel={() => setPreviewOpen(false)}
            footer={null}
            
          >
            <Image src={previewImage} alt="Product Photo" />
          </Modal>
        )}
      </div>
    </ProtectedRoute>
  );
}
