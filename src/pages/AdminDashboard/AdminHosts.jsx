import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/api";
import { AdminLayout, AdminTable, LoadingPanel } from "./AdminLayout";

export default function AdminHosts() {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHosts = async () => {
    try {
      const res = await API.get("/admin/hosts/pending?limit=50");
      setHosts(res.data?.data?.hosts || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Pending hosts load nahi ho pa rahe hain.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHosts();
  }, []);

  const updateHost = async (id, action) => {
    try {
      await API.put(`/admin/hosts/${action}/${id}`);
      toast.success(`Host ${action}d`);
      fetchHosts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Host update failed.");
    }
  };

  if (loading) return <LoadingPanel />;

  return (
    <AdminLayout title="Host Verification" subtitle="Approve or reject pending host accounts">
      <AdminTable
        rows={hosts}
        emptyMessage="No pending host verifications."
        columns={[
          { key: "name", label: "Host" },
          { key: "email", label: "Email" },
          { key: "verificationStatus", label: "Status" },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <button
                  onClick={() => updateHost(row._id, "approve")}
                  className="px-3 py-2 rounded-lg bg-green-600 text-white font-bold"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateHost(row._id, "reject")}
                  className="px-3 py-2 rounded-lg bg-red-600 text-white font-bold"
                >
                  Reject
                </button>
              </div>
            ),
          },
        ]}
      />
    </AdminLayout>
  );
}
