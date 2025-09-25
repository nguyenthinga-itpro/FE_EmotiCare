import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScrollTable from "../../../components/InfiniteScrollTable/InfiniteScrollTable";
import TableHeader from "../../../components/TableHeader/TableHeader";
import DetailModal from "../../../components/DetailModal/DetailModal";
import FormModal from "../../../components/FormModal/FormModal";
import useRealtimeListener from "../../../components/useRealtimeListener/useRealtimeListener";
import { generateColumns } from "../../../config/configTable";
import {
  getAllFaqs,
  prependFaq,
  updateFaqRealtime,
  removeFaqRealtime,
  clearFaqState,
  toggleFaqStatus,
  createFaq,
  updateFaq,
} from "../../../redux/Slices/FAQSlice";
import { faqColumnsConfig } from "./FAQConfig";
import { toast } from "react-toastify";
import { getFirestore } from "firebase/firestore";
import { Form, Switch } from "antd";
import DOMPurify from "dompurify";
import "./FAQManagement.css";
import OverlayLoader from "../../../components/OverlayLoader/OverlayLoader";
export default function FAQManagement() {
  const dispatch = useDispatch();
  const db = getFirestore();

  const {
    paginatedFaqs,
    loading,
    error,
    message,
    total,
    pageSize,
    nextCursor,
  } = useSelector((s) => s.faq);

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
    dispatch(getAllFaqs({ pageSize }));
  }, [dispatch, pageSize]);

  // Realtime listener (đổi từ emotions → faqs)
  useRealtimeListener({
    db,
    collectionName: "faqs",
    dispatchAdd: prependFaq,
    dispatchUpdate: updateFaqRealtime,
    dispatchRemove: removeFaqRealtime,
    active: realtimeActive,
  });

  // Toast messages
  useEffect(() => {
    if (message) {
      if (!justCreatedRef.current) toast.success(message);
      else justCreatedRef.current = false;
      dispatch(clearFaqState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearFaqState());
    }
  }, [message, error, dispatch]);

  const handleLoadMore = () => {
    if (nextCursor && !loading)
      dispatch(getAllFaqs({ pageSize, startAfterId: nextCursor }));
  };

  const handleToggle = (checked, record) => {
    dispatch(toggleFaqStatus({ id: record.id, isDisabled: !checked }));
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
      await dispatch(createFaq(values)).unwrap();
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
      await dispatch(updateFaq({ id: selected.id, ...values })).unwrap();
      setEditModalOpen(false);
      form.resetFields();
      setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered data
  const filteredData = paginatedFaqs.filter((e) =>
    e.question.toLowerCase().includes(searchText.toLowerCase())
  );

  const dataSource = filteredData.map((e, i) => ({
    ...e,
    key: e.id,
    index: i + 1,
    question: (
      <div style={{ cursor: "pointer" }} onClick={() => handleViewDetail(e)}>
        {e.question}
      </div>
    ),
    answer: (
      <div
        className="description-html"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(e.answer || ""),
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

  const columns = generateColumns([...faqColumnsConfig]);

  return (
    <div className="users-management">
      <h3 className="title-users-management">FAQ Management</h3>
      <TableHeader
        searchText={searchText}
        setSearchText={setSearchText}
        onAddClick={() => setCreateModalOpen(true)}
        addLabel="FAQ"
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
        title="FAQ Detail"
        fields={[
          { label: "Question", key: "question" },
          { label: "Answer", key: "answer", type: "html" },
          { label: "Category", key: "category" },
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
        title="Create FAQ"
        fields={[
          {
            name: "question",
            label: "Question",
            type: "input",
            rules: [{ required: true, message: "Enter question" }],
          },
          {
            name: "answer",
            label: "Answer",
            type: "textarea",
            rules: [{ required: true, message: "Enter answer" }],
          },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: [
              { value: "general", label: "General" },
              { value: "privacy", label: "Privacy" },
              { value: "chatbox", label: "Chatbox" },
              { value: "support", label: "Support" },
            ],
          },
        ]}
      />

      {/* Edit Modal */}
      <FormModal
        visible={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onSubmit={handleUpdate}
        form={form}
        title="Edit FAQ"
        fields={[
          {
            name: "question",
            label: "Question",
            type: "input",
            rules: [{ required: true, message: "Enter question" }],
          },
          {
            name: "answer",
            label: "Answer",
            type: "textarea",
            rules: [{ required: true, message: "Enter answer" }],
          },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: [
              { value: "general", label: "General" },
              { value: "privacy", label: "Privacy" },
              { value: "chatbox", label: "Chatbox" },
              { value: "support", label: "Support" },
            ],
          },
        ]}
      />
    </div>
  );
}
