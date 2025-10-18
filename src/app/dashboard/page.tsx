"use client";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnType } from "antd";
import { Button, Image, Input, Modal, Popconfirm, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

import { Product } from "@/types/product";
type DataIndex = keyof Product;

import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/redux/features/productSlice";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function ProductsPage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const { data: products, isLoading } = useGetProductsQuery({});

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();

      toast.success("Product deleted successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
    }
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
    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
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
      render: (_: unknown, record: Product) => {
        const fallbackImage = "https://via.placeholder.com/150?text=No+Image";
        const imageUrl =
          Array.isArray(record?.images) && record.images.length > 0
            ? record.images[0]
            : fallbackImage;

        return (
          <Image
            src={imageUrl}
            alt="Product Photo"
            onClick={() => {
              if (Array.isArray(record?.images) && record.images.length > 0) {
                setPreviewImage(record.images[0]);
                setPreviewOpen(true);
              }
            }}
            style={{
              width: "100px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "5px",
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          />
        );
      },
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
      width: 250,
      render: (text: string) => (
        <span>{text.length > 50 ? text.slice(0, 50) + "..." : text}</span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
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
            <Popconfirm
              title="Delete this product?"
              description="Are you sure to delete this product?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(item.id as string)}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
            <Link href={`/dashboard/product/${item.slug}`}>view</Link>
            <Link href={`/dashboard/product/edit/${item.slug}`}>Edit</Link>

            {/* <Button danger onClick={() => handleDelete(item.id as string)}>
              Delete
            </Button> */}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="">
      <div className="flex flex-col lg:flex-row gap-1 items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Product List</h1>
        <div className="text-sm md:text-lg lg:text-3xl font-bold">
          <Button type="primary">
            <Link href="/dashboard/product/create">+ Add Product</Link>
          </Button>
        </div>
      </div>
      <div className="responsive-table-container">
        <Table
          loading={isLoading || isDeleting}
          // pagination={{ pageSize: 6 }}
          size="small"
          className="table-auto"
          // style={{ tableLayout: "auto" }}
          bordered
          columns={colums}
          dataSource={products || []}
          rowKey="id"
          scroll={{ x: "max-content", y: 55 * 7 }} // horizontal scroll যোগ
          style={{ tableLayout: "fixed" }} // fixed layout + min width
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
      <Toaster position="top-center" />
    </div>
  );
}
