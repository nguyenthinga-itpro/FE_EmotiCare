import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScrollTable from "../../../components/InfiniteScrollTable/InfiniteScrollTable";
import TableHeader from "../../../components/TableHeader/TableHeader";
import DetailModal from "../../../components/DetailModal/DetailModal";
import FormModal from "../../../components/FormModal/FormModal";
import useRealtimeListener from "../../../components/useRealtimeListener/useRealtimeListener";
import { generateColumns } from "../../../config/configTable";
import {
  getAllChats,
  prependChat,
  updateChatRealtime,
  removeChatRealtime,
  clearChatState,
  toggleChatStatus,
  createChat,
  updateChat,
  uploadImage,
  updateImage,
} from "../../../redux/Slices/ChatAISlice";
import { getAllCategories } from "../../../redux/Slices/CategorySlice";
import { chatColumnsConfig } from "./ChatAIConfig";
import { toast } from "react-toastify";
import { getFirestore } from "firebase/firestore";
import { Form, Switch } from "antd";
import DOMPurify from "dompurify";
import "./ChatAIManagement.css";
import OverlayLoader from "../../../components/OverlayLoader/OverlayLoader";
export default function ChatAIManagement() {
  const dispatch = useDispatch();
  const db = getFirestore();
  const {
    paginatedChats,
    loading,
    error,
    message,
    total,
    pageSize,
    nextCursor,
  } = useSelector((s) => s.chat);
  const { paginatedCategories } = useSelector((s) => s.category);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [editFileList, setEditFileList] = useState([]);
  const justCreatedRef = useRef(false);
  const [realtimeActive, setRealtimeActive] = useState(true);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    dispatch(getAllCategories({ pageSize: 100 }));
  }, [dispatch]);
  useEffect(() => {
    dispatch(getAllChats({ pageSize }));
  }, [dispatch, pageSize]);
  const categoryOptions = paginatedCategories.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  // Realtime
  useRealtimeListener({
    db,
    collectionName: "chatAIs",
    dispatchAdd: prependChat,
    dispatchUpdate: updateChatRealtime,
    dispatchRemove: removeChatRealtime,
    active: realtimeActive,
  });

  // Toast messages
  useEffect(() => {
    if (message) {
      if (!justCreatedRef.current) toast.success(message);
      else justCreatedRef.current = false;
      dispatch(clearChatState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearChatState());
    }
  }, [message, error, dispatch]);

  const handleLoadMore = () => {
    if (nextCursor && !loading)
      dispatch(getAllChats({ pageSize, startAfterId: nextCursor }));
  };

  const handleToggle = (checked, record) => {
    dispatch(toggleChatStatus({ id: record.id, isDisabled: !checked }));
  };

  const handleViewDetail = (record) => {
    setSelected(record);
    setModalOpen(true);
  };

  const handleCreate = async () => {
    try {
      setRealtimeActive(false);
      let imageUrl = "";
      if (fileList.length > 0) {
        imageUrl = await dispatch(
          uploadImage(fileList[0].originFileObj)
        ).unwrap();
      }
      const values = await createForm.validateFields();
      await dispatch(
        createChat({ ...values, image: imageUrl, categoryId: values.category })
      ).unwrap();
      justCreatedRef.current = true;
      setCreateModalOpen(false);
      createForm.resetFields();
      setFileList([]);
      setRealtimeActive(true);
    } catch {
      setRealtimeActive(true);
    }
  };

  const handleEdit = (record) => {
    setSelected(record);
    form.setFieldsValue({ ...record, category: record.categoryId });
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    try {
      let imageUrl = selected.image;
      if (editFileList.length > 0)
        imageUrl = (
          await dispatch(
            updateImage({
              id: selected.id,
              file: editFileList[0].originFileObj,
            })
          ).unwrap()
        ).imageUrl;

      const values = await form.validateFields();
      await dispatch(
        updateChat({ id: selected.id, ...values, image: imageUrl })
      ).unwrap();

      setEditModalOpen(false);
      form.resetFields();
      setSelected(null);
      setEditFileList([]);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredData = paginatedChats.filter((c) =>
    (c.name + " " + c.description)
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const dataSource = filteredData.map((c, i) => ({
    ...c,
    key: c.id,
    index: i + 1,
    category: c.categoryId,
    nameDisplay: (
      <div className="table-name" onClick={() => handleViewDetail(c)}>
        {c.name}
      </div>
    ),
    toggle: (
      <Switch checked={!c.isDisabled} onChange={(v) => handleToggle(v, c)} />
    ),
    action: (
      <button
        className="btn-edit-table-management"
        onClick={() => handleEdit(c)}
      >
        Edit
      </button>
    ),
    image: <img src={c.image} alt={c.title} className="table-image" />,
    description: (
      <div
        style={{
          cursor: "pointer",
          maxWidth: 100,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        className="description-html"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(c.description || ""),
        }}
      />
    ),
    systemPrompt: (
      <div
        style={{
          cursor: "pointer",
          maxWidth: 100,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        className="description-html"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(c.systemPrompt || ""),
        }}
      />
    ),
  }));
  const columns = generateColumns(
    [...chatColumnsConfig],
    null,
    paginatedCategories
  );
  const formatTimestamp = (v) => {
    if (!v) return "N/A";
    if (typeof v.toDate === "function") return v.toDate().toLocaleString();
    if (v._seconds) {
      const date = new Date(
        v._seconds * 1000 + Math.floor(v._nanoseconds / 1e6)
      );
      return date.toLocaleString();
    }
    if (v instanceof Date) return v.toLocaleString();
    return String(v);
  };

  return (
    <div className="users-management ">
      <h3 className="title-users-management">AIs Management</h3>
      <TableHeader
        searchText={searchText}
        setSearchText={setSearchText}
        onAddClick={() => setCreateModalOpen(true)}
        addLabel="Persona"
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
        className="persona-image-container"
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selected}
        title="AIs Detail"
        fields={[
          { label: "Name", key: "name" },
          { label: "System Prompt", key: "systemPrompt" },
          { label: "Description", key: "description", type: "html" },
          { label: "Category", key: "category" },
          { label: "Default Greeting", key: "defaultGreeting" },
          {
            label: "Image",
            key: "image",
            render: (r) =>
              r.image ? (
                <img src={r.image} alt={r.name} style={{ width: 120 }} />
              ) : (
                "N/A"
              ),
          },
          {
            label: "Disabled",
            key: "isDisabled",
            render: (r) => (r.isDisabled ? "Yes" : "No"),
          },
          {
            label: "Created At",
            key: "createdAt",
            render: (r) => formatTimestamp(r.createdAt),
          },
          {
            label: "Updated At",
            key: "updatedAt",
            render: (r) => formatTimestamp(r.updatedAt),
          },
        ]}
      />
      <FormModal
        className="create-image-container"
        visible={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSubmit={handleCreate}
        form={createForm}
        title="Create Persona"
        fields={[
          {
            name: "name",
            label: "Name",
            type: "input",
            rules: [{ required: true, message: "Enter name" }],
          },
          {
            name: "systemPrompt",
            label: "System Prompt",
            type: "input",
            rules: [{ required: true, message: "Enter system prompt" }],
          },
          { name: "description", label: "Description", type: "textarea" },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: categoryOptions,
          },
          { name: "defaultGreeting", label: "Default Greeting", type: "input" },
          {
            name: "image",
            label: "Upload Image",
            type: "upload",
            fileList,
            setFileList,
          },
        ]}
      />
      <FormModal
        className="update-image-container"
        visible={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onSubmit={handleUpdate}
        form={form}
        title="Edit Persona"
        fields={[
          {
            name: "name",
            label: "Name",
            type: "input",
            rules: [{ required: true, message: "Enter name" }],
          },
          {
            name: "systemPrompt",
            label: "System Prompt",
            type: "input",
            rules: [{ required: true, message: "Enter system prompt" }],
          },
          { name: "description", label: "Description", type: "textarea" },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: categoryOptions,
          },
          { name: "defaultGreeting", label: "Default Greeting", type: "input" },
          {
            name: "image",
            label: "Update Image",
            type: "upload",
            fileList: editFileList,
            setFileList: setEditFileList,
          },
        ]}
      />
    </div>
  );
}
