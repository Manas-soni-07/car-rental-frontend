import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/api";
import { AdminLayout, AdminTable, LoadingPanel } from "./AdminLayout";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users?limit=50");
      setUsers(res.data?.data?.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Users load nahi ho pa rahe hain.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlock = async (user) => {
    try {
      await API.put(`/admin/users/${user.isBlocked ? "unblock" : "block"}/${user._id}`);
      toast.success(user.isBlocked ? "User unblocked" : "User blocked");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "User update failed.");
    }
  };

  if (loading) return <LoadingPanel />;

  return (
    <AdminLayout title="User Management" subtitle="Block, unblock and review platform accounts">
      <AdminTable
        rows={users}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status", render: (row) => (row.isBlocked ? "Blocked" : "Active") },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <button
                onClick={() => toggleBlock(row)}
                className={`px-3 py-2 rounded-lg text-white font-bold ${
                  row.isBlocked ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {row.isBlocked ? "Unblock" : "Block"}
              </button>
            ),
          },
        ]}
      />
    </AdminLayout>
  );
}
