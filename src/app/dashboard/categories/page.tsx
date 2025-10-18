"use client";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnType } from "antd";
import { Button, Image, Input, Modal, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

import { Category } from "@/types/product";
type DataIndex = keyof Category;

import {
  useDeleteProductMutation,
  useGetCategoriesQuery,
} from "@/redux/features/productSlice";
import Link from "next/link";

export default function CategoriesPage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const { data: categories, isLoading } = useGetCategoriesQuery({});

  const [deleteProduct] = useDeleteProductMutation();

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
  ): TableColumnType<Category> => ({
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
      render: (_: unknown, record: Category) => {
        const fallbackImage = "https://via.placeholder.com/150?text=No+Image";
        const imageUrl = record.image ? record.image : fallbackImage;

        return (
          <Image
            src={imageUrl}
            alt="Category Photo"
            onClick={() => {
              if (record.image.length > 0) {
                setPreviewImage(record.image);
                setPreviewOpen(true);
              }
            }}
            style={{
              width: "80px",
              height: "80px",
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
      title: "Action",
      key: "action",
      render: (item: Category) => {
        return (
          <Space>
            <Link href={`/categories/edit/${item.id}`}>Edit</Link>

            <Button danger onClick={() => handleDelete(item.id as string)}>
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="">
      <div className="flex flex-col lg:flex-row gap-1 items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Categories List</h1>
        <div className="text-sm md:text-lg lg:text-3xl font-bold">
          <Button type="primary">
            <Link href="/dashboard/categories/create">+ Add Category</Link>
          </Button>
        </div>
      </div>
      <div className="responsive-table-container">
        <Table<Category>
          loading={isLoading}
          pagination={{ pageSize: 6 }}
          size="small"
          className="table-auto"
          // style={{ tableLayout: "auto" }}
          bordered
          columns={colums}
          dataSource={categories || []}
          rowKey="id"
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
  );
}
