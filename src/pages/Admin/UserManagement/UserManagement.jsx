import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Form } from "antd";
import { toast } from "react-toastify";
import InfiniteScrollTable from "../../../components/InfiniteScrollTable/InfiniteScrollTable";
import TableHeader from "../../../components/TableHeader/TableHeader";
import DetailModal from "../../../components/DetailModal/DetailModal";
import FormModal from "../../../components/FormModal/FormModal";
import useRealtimeListener from "../../../components/useRealtimeListener/useRealtimeListener";
import { generateColumns } from "../../../config/configTable";
import { userColumnsConfig } from "./UserConfig";
import {
  getAllUsers,
  prependUser,
  updateUserRealtime,
  removeUserRealtime,
  clearUserState,
  toggleUserStatus,
  createUser,
  updateUser,
} from "../../../redux/Slices/UserSlice";
import { getFirestore } from "firebase/firestore";
import "./UserManagement.css";
import OverlayLoader from "../../../components/OverlayLoader/OverlayLoader";
export default function UserManagement() {
  const dispatch = useDispatch();
  const db = getFirestore();

  const {
    paginatedUsers,
    loading,
    error,
    message,
    total,
    pageSize,
    nextCursor,
  } = useSelector((s) => s.users);

  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const justCreatedRef = useRef(false);
  const [realtimeActive, setRealtimeActive] = useState(true);
  const [searchText, setSearchText] = useState("");

  // Initial fetch
  useEffect(() => {
    dispatch(getAllUsers({ pageSize }));
  }, [dispatch, pageSize]);

  // Realtime listener
  useRealtimeListener({
    db,
    collectionName: "users",
    dispatchAdd: prependUser,
    dispatchUpdate: updateUserRealtime,
    dispatchRemove: removeUserRealtime,
    active: realtimeActive,
  });

  // Toast messages
  useEffect(() => {
    if (message) {
      if (!justCreatedRef.current) toast.success(message);
      else justCreatedRef.current = false;
      dispatch(clearUserState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearUserState());
    }
  }, [message, error, dispatch]);

  // Handlers
  const handleLoadMore = () => {
    if (nextCursor && !loading)
      dispatch(getAllUsers({ pageSize, startAfterId: nextCursor }));
  };
  const handleToggle = (checked, record) => {
    dispatch(toggleUserStatus({ id: record.id, isDisabled: !checked }));
  };
  const handleViewDetail = (record) => {
    setSelected(record);
    setDetailOpen(true);
  };
  const handleCreate = async () => {
    try {
      setRealtimeActive(false);
      const values = await createForm.validateFields();
      await dispatch(createUser(values)).unwrap();
      justCreatedRef.current = true;
      setCreateOpen(false);
      createForm.resetFields();
      setRealtimeActive(true);
    } catch {
      setRealtimeActive(true);
    }
  };
  const handleEdit = (record) => {
    setSelected(record);
    form.setFieldsValue(record);
    setEditOpen(true);
  };
  const handleUpdate = async () => {
    if (!selected) return;
    try {
      const values = await form.validateFields();
      await dispatch(updateUser({ id: selected.id, ...values })).unwrap();
      setEditOpen(false);
      form.resetFields();
      setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Utils
  const formatValue = (val, onlyDate = false) => {
    if (!val) return "N/A";

    if (val._seconds) {
      const d = new Date(val._seconds * 1000);
      return onlyDate ? d.toLocaleDateString() : d.toLocaleString();
    }

    if (typeof val === "string" || val instanceof Date) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return onlyDate ? d.toLocaleDateString() : d.toLocaleString();
      }
    }

    return String(val);
  };

  // Data for table
  const filteredData = paginatedUsers.filter((u) =>
    (u.name + " " + u.email).toLowerCase().includes(searchText.toLowerCase())
  );
  const dataSource = filteredData.map((u, i) => ({
    ...u,
    key: u.id,
    index: i + 1,
    accountCell: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
        }}
        className="accountcell-datasource-users-management"
        onClick={() => handleViewDetail(u)}
      >
        <img
          src={u.image || "https://i.pravatar.cc/150?img=3"}
          alt={u.name}
          style={{ width: 40, height: 40, borderRadius: "50%" }}
          className="image-datasource-users-management"
        />
        <div
          style={{ textAlign: "left" }}
          className="name-datasource-users-management"
        >
          <div>{u.name}</div>
          <div
            style={{ fontSize: 12, color: "#888" }}
            className="email-datasource-users-management"
          >
            {u.email}
          </div>
        </div>
      </div>
    ),
    gender: u.gender || "N/A",
    role: u.role || "N/A",
    dateOfBirth: formatValue(u.dateOfBirth, true),
    lastActive: formatValue(u.lastActive),
    toggle: (
      <Switch
        checked={!u.isDisabled}
        onChange={(checked) => handleToggle(checked, u)}
      />
    ),
    action: (
      <button className="edit-button" onClick={() => handleEdit(u)}>
        Edit
      </button>
    ),
  }));

  const columns = generateColumns([...userColumnsConfig]);

  return (
    <div className="users-management">
      <h3 className="title-users-management">Users Management</h3>
      <TableHeader
        searchText={searchText}
        setSearchText={setSearchText}
        // onAddClick={() => setCreateOpen(true)}
        // addLabel="User"
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
        visible={detailOpen}
        onClose={() => setDetailOpen(false)}
        data={selected}
        title="User Detail"
        fields={[
          { label: "Name", key: "name" },
          { label: "Email", key: "email" },
          { label: "Address", key: "address" },
          { label: "Gender", key: "gender" },
          { label: "Role", key: "role" },
          { label: "Mode", key: "mode" },
          {
            label: "Disabled",
            key: "isDisabled",
            render: (r) => (r.isDisabled ? "Yes" : "No"),
          },
          {
            label: "Verified",
            key: "isVerify",
            render: (r) => (r.isVerify ? "Yes" : "No"),
          },
          {
            label: "Date of Birth",
            key: "dateOfBirth",
            render: (r) => formatValue(r.dateOfBirth, true),
          },
          {
            label: "Created At",
            key: "createdAt",
            render: (r) => formatValue(r.createdAt),
          },
          {
            label: "Updated At",
            key: "updatedAt",
            render: (r) => formatValue(r.updatedAt),
          },
          {
            label: "Last Active",
            key: "lastActive",
            render: (r) => formatValue(r.lastActive),
          },
          {
            label: "Verify Expire At",
            key: "verifyExpireAt",
            render: (r) => formatValue(r.verifyExpireAt),
          },
          {
            label: "Image",
            key: "image",
            render: (r) => (
              <img
                src={r.image || "https://i.pravatar.cc/150?img=3"}
                alt={r.name}
                style={{ width: 80, height: 80, borderRadius: "50%" }}
                className="image-users-management"
              />
            ),
          },
        ]}
      />
      {/* Create Modal */}
      <FormModal
        visible={createOpen}
        onCancel={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        form={createForm}
        title="Create User"
        fields={[
          {
            name: "name",
            label: "Name",
            type: "input",
            rules: [{ required: true }],
          },
          {
            name: "email",
            label: "Email",
            type: "input",
            rules: [{ required: true }],
          },
          { name: "address", label: "Address", type: "input" },
          {
            name: "gender",
            label: "Gender",
            type: "select",
            options: [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ],
          },
          {
            name: "role",
            label: "Role",
            type: "select",
            options: [
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ],
          },
        ]}
      />
      {/* Edit Modal */}
      <FormModal
        visible={editOpen}
        onCancel={() => setEditOpen(false)}
        onSubmit={handleUpdate}
        form={form}
        title="Edit User"
        fields={[
          { name: "name", label: "Name", type: "input" },
          { name: "email", label: "Email", type: "input" },
          { name: "address", label: "Address", type: "input" },
          {
            name: "gender",
            label: "Gender",
            type: "select",
            options: [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ],
          },
          {
            name: "role",
            label: "Role",
            type: "select",
            options: [
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ],
          },
        ]}
      />
    </div>
  );
}
