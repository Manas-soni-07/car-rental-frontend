import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/api";
import { AdminLayout, AdminTable, LoadingPanel } from "./AdminLayout";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/admin/bookings?limit=50");
        setBookings(res.data?.data?.bookings || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Bookings load nahi ho pa rahi hain.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <LoadingPanel />;

  return (
    <AdminLayout title="Booking Moderation" subtitle="Monitor all bookings, lifecycle and payment states">
      <AdminTable
        rows={bookings}
        columns={[
          { key: "car", label: "Car", render: (row) => row.car?.name || "-" },
          { key: "user", label: "User", render: (row) => row.user?.name || "-" },
          { key: "bookingStatus", label: "Booking" },
          { key: "rideStatus", label: "Ride" },
          { key: "paymentStatus", label: "Payment" },
          { key: "totalAmount", label: "Total", render: (row) => money(row.totalAmount || row.totalPrice) },
          { key: "hostEarning", label: "Host Earning", render: (row) => money(row.hostEarning) },
          { key: "platformCommission", label: "Commission", render: (row) => money(row.platformCommission) },
        ]}
      />
    </AdminLayout>
  );
}
