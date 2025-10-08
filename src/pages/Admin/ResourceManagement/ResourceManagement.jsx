// src/pages/Admin/Resource/ResourceManagement.js
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScrollTable from "../../../components/InfiniteScrollTable/InfiniteScrollTable";
import TableHeader from "../../../components/TableHeader/TableHeader";
import DetailModal from "../../../components/DetailModal/DetailModal";
import FormModal from "../../../components/FormModal/FormModal";
import useRealtimeListener from "../../../components/useRealtimeListener/useRealtimeListener";
import { generateColumns } from "../../../config/configTable";
import {
  getAllResources,
  prependResource,
  updateResourceRealtime,
  removeResourceRealtime,
  clearResourceState,
  toggleResourceStatus,
  createResource,
  updateResource,
} from "../../../redux/Slices/ResourseSlice";
import { getAllCategories } from "../../../redux/Slices/CategorySlice";
import { resourceColumnsConfig } from "./ResourceConfig";
import { toast } from "react-toastify";
import { getFirestore } from "firebase/firestore";
import { Form, Switch } from "antd";
import DOMPurify from "dompurify";
import "./ResourceManagement.css";
import OverlayLoader from "../../../components/OverlayLoader/OverlayLoader";
export default function ResourceManagement() {
  const dispatch = useDispatch();
  const db = getFirestore();

  const {
    paginatedResources,
    loading,
    error,
    message,
    total,
    pageSize,
    nextCursor,
  } = useSelector((s) => s.resource);
  const { paginatedCategories } = useSelector((s) => s.category);
  const [selected, setSelected] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const justCreatedRef = useRef(false);
  const [realtimeActive, setRealtimeActive] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(getAllCategories({ pageSize: 100 }));
  }, [dispatch]);
  useEffect(() => {
    dispatch(getAllResources({ pageSize }));
  }, [dispatch, pageSize]);
  const categoryOptions = paginatedCategories.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  // Realtime listener
  useRealtimeListener({
    db,
    collectionName: "resources",
    dispatchAdd: prependResource,
    dispatchUpdate: updateResourceRealtime,
    dispatchRemove: removeResourceRealtime,
    active: realtimeActive,
  });

  // Toast messages
  useEffect(() => {
    if (message) {
      if (!justCreatedRef.current) toast.success(message);
      else justCreatedRef.current = false;
      dispatch(clearResourceState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearResourceState());
    }
  }, [message, error, dispatch]);

  const handleLoadMore = () => {
    if (nextCursor && !loading)
      dispatch(getAllResources({ pageSize, startAfterId: nextCursor }));
  };

  const handleToggle = (checked, record) => {
    dispatch(toggleResourceStatus({ id: record.id, isDisabled: !checked }));
  };

  const handleViewDetail = (record) => {
    setSelected({ ...record, category: record.name });
    setDetailModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelected(record);
    form.setFieldsValue({ ...record, category: record.categoryId });
    setEditModalOpen(true);
  };

  const handleCreate = async () => {
    try {
      setRealtimeActive(false);
      const values = await createForm.validateFields();
      await dispatch(
        createResource({
          ...values,
          categoryId: values.category,
        })
      ).unwrap();
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
      await dispatch(
        updateResource({
          id: selected.id,
          updateVideo: true,
          ...values,
          categoryId: values.category,
        })
      ).unwrap();

      setEditModalOpen(false);
      form.resetFields();
      setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered data
  const filteredData = paginatedResources.filter((e) =>
    e.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const dataSource = filteredData.map((e, i) => ({
    ...e,
    key: e.id,
    index: i + 1,
    category: e.categoryId,
    title: (
      <div
        style={{
          cursor: "pointer",
          maxWidth: 100,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        onClick={() => handleViewDetail(e)}
      >
        {e.title}
      </div>
    ),
    description: (
      <div
        style={{
          maxWidth: 100,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        className="description-html"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(e.description || ""),
        }}
      />
    ),
    content: (
      <div
        className="content-html"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(e.content || ""),
        }}
      />
    ),
    video: (
      <iframe
        width="200"
        height="113"
        src={`https://www.youtube.com/embed/${e.videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={e.title}
      />
    ),
    categoryDisplay: <div>{e.categoryId}</div>,
    image: (
      <img
        src={e.image}
        alt={e.title}
        className="table-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/default.png";
        }}
      />
    ),
    toggle: (
      <Switch
        checked={!e.isDisabled}
        onChange={(checked) => handleToggle(checked, e)}
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

  const columns = generateColumns(
    [...resourceColumnsConfig],
    null,
    paginatedCategories
  );

  return (
    <div className="users-management">
      <h3 className="title-users-management">Resource Management</h3>
      <TableHeader
        searchText={searchText}
        setSearchText={setSearchText}
        onAddClick={() => setCreateModalOpen(true)}
        addLabel="Resource"
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
      {/* Detail Modal */}
      <DetailModal
        visible={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        data={selected}
        title="Resource Detail"
        fields={[
          { label: "Title", key: "title" },
          { label: "Description", key: "description", type: "html" },
          { label: "Type", key: "type" },
          { label: "Content", key: "content", type: "html" },
          { label: "Category", key: "category" },
          { label: "URL", key: "url" },
          { label: "Thumbnail", key: "image", type: "image" },
          { label: "Video ID", key: "videoId" },
          {
            label: "Disabled",
            key: "isDisabled",
            render: (r) => (r.isDisabled ? "Yes" : "No"),
          },
          { label: "Created At", key: "createdAt" },
          { label: "Updated At", key: "updatedAt" },
        ]}
      />

      {/* Create Modal */}
      <FormModal
        visible={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSubmit={handleCreate}
        form={createForm}
        title="Create Resource"
        fields={[
          {
            name: "title",
            label: "Title",
            type: "input",
            // rules: [{ required: true, message: "Enter title" }],
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
          },
          {
            name: "type",
            label: "Type",
            type: "select",
            options: [
              { value: "youtube", label: "youtube" },
              { value: "news", label: "news" },
            ],
            rules: [{ required: true, message: "Select type" }],
          },
          {
            name: "category", // ✅ sửa lại
            label: "Category",
            type: "select",
            options: categoryOptions,
            rules: [{ required: true, message: "Select category" }],
          },

          {
            name: "url",
            label: "URL",
            type: "input",
            rules: [{ required: true, message: "Enter URL" }],
          },
        ]}
      />

      {/* Edit Modal */}
      <FormModal
        visible={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onSubmit={handleUpdate}
        form={form}
        title="Edit Resource"
        fields={[
          {
            name: "title",
            label: "Title",
            type: "input",
            rules: [{ required: true, message: "Enter title" }],
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
          },
          {
            name: "type",
            label: "Type",
            type: "select",
            options: [
              { value: "youtube", label: "youtube" },
              { value: "news", label: "news" },
            ],
            rules: [{ required: true, message: "Select type" }],
          },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: categoryOptions,
            rules: [{ required: true, message: "Select category" }],
          },
          {
            name: "url",
            label: "URL",
            type: "input",
            rules: [{ required: true, message: "Enter URL" }],
          },
        ]}
      />
    </div>
  );
}
