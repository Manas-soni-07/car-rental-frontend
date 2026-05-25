import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/api";
import { AdminLayout, AdminTable, LoadingPanel } from "./AdminLayout";

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const res = await API.get("/admin/cars?limit=50");
      setCars(res.data?.data?.cars || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Cars load nahi ho pa rahi hain.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const moderate = async (car, action) => {
    try {
      if (action === "remove" && !window.confirm("Remove this car permanently?")) return;
      await API[action === "remove" ? "delete" : "put"](`/admin/cars/${action}/${car._id}`);
      toast.success(`Car ${action}d`);
      fetchCars();
    } catch (err) {
      toast.error(err.response?.data?.message || "Car moderation failed.");
    }
  };

  if (loading) return <LoadingPanel />;

  return (
    <AdminLayout title="Car Moderation" subtitle="Hide, unhide or remove marketplace cars">
      <AdminTable
        rows={cars}
        columns={[
          { key: "name", label: "Car" },
          { key: "brand", label: "Brand" },
          { key: "location", label: "City" },
          { key: "host", label: "Host", render: (row) => row.host?.name || "-" },
          { key: "moderationStatus", label: "Status" },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <button
                  onClick={() => moderate(row, row.isHidden ? "unhide" : "hide")}
                  className="px-3 py-2 rounded-lg bg-black text-white font-bold"
                >
                  {row.isHidden ? "Unhide" : "Hide"}
                </button>
                <button
                  onClick={() => moderate(row, "remove")}
                  className="px-3 py-2 rounded-lg bg-red-600 text-white font-bold"
                >
                  Remove
                </button>
              </div>
            ),
          },
        ]}
      />
    </AdminLayout>
  );
}
