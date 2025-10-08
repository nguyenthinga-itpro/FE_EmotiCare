import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScrollTable from "../../../components/InfiniteScrollTable/InfiniteScrollTable";
import TableHeader from "../../../components/TableHeader/TableHeader";
import DetailModal from "../../../components/DetailModal/DetailModal";
import FormModal from "../../../components/FormModal/FormModal";
import useRealtimeListener from "../../../components/useRealtimeListener/useRealtimeListener";
import { generateColumns } from "../../../config/configTable";
import { emotionColumnsConfig } from "./EmotionConfig";
import {
  getAllEmotions,
  prependEmotion,
  updateEmotionRealtime,
  removeEmotionRealtime,
  clearEmotionState,
  toggleEmotionStatus,
  createEmotion,
  updateEmotion,
} from "../../../redux/Slices/EmotionSlice";
import { getAllCategories } from "../../../redux/Slices/CategorySlice";
import { getFirestore } from "firebase/firestore";
import { Form, Switch } from "antd";
import { toast } from "react-toastify";
import "./EmotionManagement.css";
import OverlayLoader from "../../../components/OverlayLoader/OverlayLoader";
export default function EmotionManagement() {
  const dispatch = useDispatch();
  const db = getFirestore();

  const {
    paginatedEmotions,
    loading,
    error,
    message,
    total,
    pageSize,
    nextCursor,
  } = useSelector((s) => s.emotion);
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
    dispatch(getAllEmotions({ pageSize }));
  }, [dispatch, pageSize]);
  const categoryOptions = paginatedCategories.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  // Realtime listener
  useRealtimeListener({
    db,
    collectionName: "emotions",
    dispatchAdd: prependEmotion,
    dispatchUpdate: updateEmotionRealtime,
    dispatchRemove: removeEmotionRealtime,
    active: realtimeActive,
  });

  // Toast messages
  useEffect(() => {
    if (message) {
      if (!justCreatedRef.current) toast.success(message);
      else justCreatedRef.current = false;
      dispatch(clearEmotionState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearEmotionState());
    }
  }, [message, error, dispatch]);

  const handleLoadMore = () => {
    if (nextCursor && !loading)
      dispatch(getAllEmotions({ pageSize, startAfterId: nextCursor }));
  };
  const handleToggle = (checked, record) => {
    dispatch(toggleEmotionStatus({ id: record.id, isDisabled: !checked }));
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
        createEmotion({
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
        updateEmotion({
          id: selected.id,
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
  const filteredData = paginatedEmotions.filter((e) =>
    String(e.name || "")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const dataSource = filteredData.map((e, i) => ({
    ...e,
    key: e.id,
    index: i + 1,
    category: e.categoryId,
    detail: (
      <div style={{ cursor: "pointer" }} onClick={() => handleViewDetail(e)}>
        {e.name}
      </div>
    ),
    emojiDisplay: (
      <div
        style={{ fontSize: 24, cursor: "pointer" }}
        onClick={() => handleViewDetail(e)}
      >
        {e.emoji || "❓"}
      </div>
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
    [...emotionColumnsConfig],
    null,
    paginatedCategories
  );

  return (
    <div className="users-management ">
      <h3 className="title-users-management">Emotions Management</h3>
      <TableHeader
        searchText={searchText}
        setSearchText={setSearchText}
        onAddClick={() => setCreateModalOpen(true)}
        addLabel="Emotion"
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
        title="Emotion Detail"
        fields={[
          { label: "Name", key: "name" },
          { label: "Category", key: "category" },
          { label: "Emoji", key: "emoji" },
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
        title="Create Emotion"
        fields={[
          {
            name: "name",
            label: "Name",
            type: "input",
            rules: [{ required: true, message: "Enter name" }],
          },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: categoryOptions,
          },
          { name: "emoji", label: "Emoji", type: "emoji" },
          { name: "description", label: "Description", type: "textarea" },
        ]}
      />

      <FormModal
        visible={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onSubmit={handleUpdate}
        form={form}
        title="Edit Emotion"
        fields={[
          {
            name: "name",
            label: "Name",
            type: "input",
            rules: [{ required: true, message: "Enter name" }],
          },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: categoryOptions,
          },
          { name: "emoji", label: "Emoji", type: "emoji" },
          { name: "description", label: "Description", type: "textarea" },
        ]}
      />
    </div>
  );
}
