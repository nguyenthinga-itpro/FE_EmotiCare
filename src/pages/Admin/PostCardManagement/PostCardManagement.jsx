import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScrollTable from "../../../components/InfiniteScrollTable/InfiniteScrollTable";
import TableHeader from "../../../components/TableHeader/TableHeader";
import DetailModal from "../../../components/DetailModal/DetailModal";
import FormModal from "../../../components/FormModal/FormModal";
import useRealtimeListener from "../../../components/useRealtimeListener/useRealtimeListener";
import { generateColumns } from "../../../config/configTable";
import {
  getAllPostcards,
  prependPostcard,
  updatePostcardRealtime,
  removePostcardRealtime,
  clearPostcardState,
  togglePostcardStatus,
  createPostcard,
  updatePostcard,
  uploadImage,
  updateImage,
} from "../../../redux/Slices/PostcardSlice";
import { getAllCategories } from "../../../redux/Slices/CategorySlice";
import { postcardColumnsConfig } from "./PostcardConfig";
import { toast } from "react-toastify";
import { getFirestore } from "firebase/firestore";
import { Form, Switch } from "antd";
import "./PostCardManagement.css";
import OverlayLoader from "../../../components/OverlayLoader/OverlayLoader";
import DOMPurify from "dompurify";
export default function PostcardManagement() {
  const dispatch = useDispatch();
  const db = getFirestore();
  const {
    paginatedPostcards,
    loading,
    error,
    message,
    total,
    pageSize,
    nextCursor,
  } = useSelector((s) => s.postcard);
  const { paginatedCategories } = useSelector((s) => s.category);
  console.log("object", paginatedCategories);
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
    dispatch(getAllPostcards({ pageSize }));
  }, [dispatch, pageSize]);
  const categoryOptions = paginatedCategories.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  useRealtimeListener({
    db,
    collectionName: "postcards",
    dispatchAdd: prependPostcard,
    dispatchUpdate: updatePostcardRealtime,
    dispatchRemove: removePostcardRealtime,
    active: realtimeActive,
  });
  useEffect(() => {
    if (message) {
      if (!justCreatedRef.current) toast.success(message);
      else justCreatedRef.current = false;
      dispatch(clearPostcardState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearPostcardState());
    }
  }, [message, error, dispatch]);

  const handleLoadMore = () => {
    if (nextCursor && !loading)
      dispatch(getAllPostcards({ pageSize, startAfterId: nextCursor }));
  };
  const handleToggle = (checked, record) => {
    dispatch(togglePostcardStatus({ id: record.id, isDisabled: !checked }));
  };
  const handleViewDetail = (record) => {
    setSelected({ ...record, category: record.name });
    setModalOpen(true);
  };

  const handleCreate = async () => {
    if (!fileList.length) return toast.error("Select file");
    try {
      setRealtimeActive(false);
      const imageUrl = await dispatch(
        uploadImage(fileList[0].originFileObj)
      ).unwrap();
      const values = await createForm.validateFields();
      await dispatch(
        createPostcard({
          ...values,
          image: imageUrl,
          categoryId: values.category,
        })
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

    form.setFieldsValue({
      ...record,
      category: record.categoryId,
      music: record.music?.external_url || "",
    });

    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    try {
      let imageUrl = selected.image;
      if (editFileList.length > 0) {
        const uploaded = await dispatch(
          updateImage({
            id: selected.id,
            file: editFileList[0].originFileObj,
          })
        ).unwrap();
        imageUrl = uploaded.imageUrl;
      }
      const values = await form.validateFields();
      const payload = {
        id: selected.id,
        title: values.title,
        description: values.description,
        image: imageUrl,
        categoryId: values.category,
      };
      const oldMusicUrl = selected.music?.external_url || "";
      if (!values.music || values.music === oldMusicUrl) {
        delete payload.music;
      } else {
        payload.music = values.music;
      }
      await dispatch(updatePostcard(payload)).unwrap();
      setEditModalOpen(false);
      form.resetFields();
      setSelected(null);
      setEditFileList([]);
    } catch (err) {
      console.error("Update postcard error:", err);
    }
  };
  const filteredData = paginatedPostcards.filter((p) =>
    (p.title + " " + p.description)
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );
  const dataSource = filteredData.map((p, i) => {
    return {
      ...p,
      key: p.id,
      index: i + 1,
      category: p.categoryId,
      titleDisplay: (
        <div
          className="table-title-postcard"
          onClick={() => handleViewDetail(p)}
        >
          {p.title}
        </div>
      ),
      musicDisplay: <div>{p.music.name}</div>,
      image: <img src={p.image} alt={p.title} className="table-image" />,
      toggle: (
        <Switch
          checked={!p.isDisabled}
          onChange={(checked) => handleToggle(checked, p)}
        />
      ),
      action: (
        <button
          className="btn-edit-table-management"
          onClick={() => handleEdit(p)}
        >
          Edit
        </button>
      ),
      description: (
        <div
          className="description-html"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(p.description || ""),
          }}
        />
      ),
    };
  });

  const columns = generateColumns(
    [...postcardColumnsConfig],
    null,
    paginatedCategories
  );

  console.log("dataSource", dataSource);
  return (
    <div className="users-management">
      <h3 className="title-users-management">Postcards Management</h3>
      <TableHeader
        searchText={searchText}
        setSearchText={setSearchText}
        onAddClick={() => setCreateModalOpen(true)}
        addLabel="Postcard"
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
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selected}
        title="Postcard Detail"
        fields={[
          { label: "Title", key: "title" },
          { label: "Description", key: "description", type: "html" },
          { label: "Category", key: "category" },
          {
            label: "Image",
            key: "image",
            render: (r) => (
              <img src={r.image} alt={r.title} style={{ width: 120 }} />
            ),
          },
          {
            label: "Disabled",
            key: "isDisabled",
            render: (r) => (r.isDisabled ? "Yes" : "No"),
          },
          {
            label: "Music",
            key: "music",
            render: (r) => r.music?.name || "-",
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
        title="Create Postcard"
        fields={[
          {
            name: "title",
            label: "Title",
            type: "input",
            rules: [{ required: true, message: "Enter title" }],
          },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: categoryOptions,
          },
          { name: "description", label: "Description", type: "textarea" },
          { name: "music", label: "Music URL", type: "input" },
          {
            name: "image",
            label: "Upload Image",
            type: "upload",
            fileList: fileList,
            setFileList: setFileList,
          },
        ]}
      />
      <FormModal
        visible={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onSubmit={handleUpdate}
        form={form}
        title="Edit Postcard"
        fields={[
          {
            name: "title",
            label: "Title",
            type: "input",
            rules: [{ required: true, message: "Enter title" }],
          },
          { name: "description", label: "Description", type: "textarea" },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: categoryOptions,
          },
          { name: "music", label: "Music URL", type: "input" },
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
