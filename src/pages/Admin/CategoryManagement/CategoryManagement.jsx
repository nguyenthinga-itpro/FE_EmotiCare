import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScrollTable from "../../../components/InfiniteScrollTable/InfiniteScrollTable";
import TableHeader from "../../../components/TableHeader/TableHeader";
import DetailModal from "../../../components/DetailModal/DetailModal";
import FormModal from "../../../components/FormModal/FormModal";
import useRealtimeListener from "../../../components/useRealtimeListener/useRealtimeListener";
import { generateColumns } from "../../../config/configTable";
import { categoryColumnsConfig } from "./CategoryConfig";
import {
  getAllCategories,
  prependCategory,
  updateCategoryRealtime,
  removeCategoryRealtime,
  clearCategoryState,
  toggleCategoryStatus,
  createCategory,
  updateCategory,
} from "../../../redux/Slices/CategorySlice";
import { getFirestore } from "firebase/firestore";
import { Form, Switch } from "antd";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import "./CategoryManagement.css";
import OverlayLoader from "../../../components/OverlayLoader/OverlayLoader";
export default function CategoryManagement() {
  const dispatch = useDispatch();
  const db = getFirestore();

  const {
    paginatedCategories,
    loading,
    error,
    message,
    total,
    pageSize,
    nextCursor,
  } = useSelector((s) => s.category);

  const [selected, setSelected] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const justCreatedRef = useRef(false);
  const [realtimeActive, setRealtimeActive] = useState(true);
  const [searchText, setSearchText] = useState("");

  // Initial fetch
  useEffect(() => {
    dispatch(getAllCategories({ pageSize }));
  }, [dispatch, pageSize]);

  // Realtime listener
  useRealtimeListener({
    db,
    collectionName: "categories",
    dispatchAdd: prependCategory,
    dispatchUpdate: updateCategoryRealtime,
    dispatchRemove: removeCategoryRealtime,
    active: realtimeActive,
  });

  // Toast messages
  useEffect(() => {
    if (message) {
      if (!justCreatedRef.current) toast.success(message);
      else justCreatedRef.current = false;
      dispatch(clearCategoryState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearCategoryState());
    }
  }, [message, error, dispatch]);

  const handleLoadMore = () => {
    if (nextCursor && !loading)
      dispatch(getAllCategories({ pageSize, startAfterId: nextCursor }));
  };

  const handleToggle = (checked, record) => {
    dispatch(toggleCategoryStatus({ id: record.id, isDisabled: !checked }));
  };
  const handleViewDetail = (record) => {
    setSelected(record);
    setDetailModalOpen(true);
  };
  const handleEdit = (record) => {
    setSelected(record);
    form.setFieldsValue(record);
    setEditModalOpen(true);
  };

  const handleCreate = async () => {
    try {
      setRealtimeActive(false);
      const values = await createForm.validateFields();
      await dispatch(createCategory(values)).unwrap();
      justCreatedRef.current = true;
      setCreateModalOpen(false);
      createForm.resetFields();
      setRealtimeActive(true);
    } catch {
      setRealtimeActive(true);
    }
  };

  const handleUpdate = async () => {
    if (!selected) return;
    try {
      const values = await form.validateFields();
      await dispatch(updateCategory({ id: selected.id, ...values })).unwrap();
      setEditModalOpen(false);
      form.resetFields();
      setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered data
  const filteredData = paginatedCategories.filter((e) =>
    String(e.name || "")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );
  const dataSource = filteredData.map((e, i) => ({
    ...e,
    key: e.id,
    index: i + 1,
    detail: (
      <div style={{ cursor: "pointer" }} onClick={() => handleViewDetail(e)}>
        {e.name}
      </div>
    ),
    toggle: (
      <Switch
        checked={!e.isDisabled}
        onChange={(checked) => handleToggle(checked, e)}
      />
    ),
    description: (
      <div
        className="description-html"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(e.description || ""),
        }}
      />
    ),
    action: (
      <button
        className="btn-edit-table-management"
        onClick={() => handleEdit(e)}
      >
        Edit
      </button>
    ),
  }));

  const columns = generateColumns([...categoryColumnsConfig]);

  return (
    <div className="users-management">
      <h3 className="title-users-management">Category Management</h3>
      <TableHeader
        searchText={searchText}
        setSearchText={setSearchText}
        onAddClick={() => setCreateModalOpen(true)}
        addLabel="Category"
      />
      <InfiniteScrollTable
        data={dataSource}
        columns={columns}
        step={pageSize}
        total={total}
        loading={loading}
        nextCursor={nextCursor}
        rowClassName={(_, i) =>
          i % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
        onLoadMore={handleLoadMore}
      />
      <OverlayLoader loading={loading} />
      <DetailModal
        visible={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        data={selected}
        title="Category Detail"
        fields={[
          { label: "Name", key: "name" },
          { label: "Description", key: "description", type: "html" },
          {
            label: "Disabled",
            key: "isDisabled",
            render: (r) => (r.isDisabled ? "Yes" : "No"),
          },
          { label: "Created At", key: "createdAt" },
          { label: "Updated At", key: "updatedAt" },
        ]}
      />

      <FormModal
        visible={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSubmit={handleCreate}
        form={createForm}
        title="Create Category"
        fields={[
          {
            name: "name",
            label: "Name",
            type: "input",
            rules: [{ required: true, message: "Enter name" }],
          },
          { name: "description", label: "Description", type: "textarea" },
        ]}
      />

      <FormModal
        visible={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onSubmit={handleUpdate}
        form={form}
        title="Edit Category"
        fields={[
          {
            name: "name",
            label: "Name",
            type: "input",
            rules: [{ required: true, message: "Enter name" }],
          },
          { name: "description", label: "Description", type: "textarea" },
        ]}
      />
    </div>
  );
}
