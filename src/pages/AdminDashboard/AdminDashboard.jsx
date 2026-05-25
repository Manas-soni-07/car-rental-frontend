import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/api";
import { AdminLayout, AdminTable, LoadingPanel, StatCard } from "./AdminLayout";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        setData(res.data?.data || {});
      } catch (err) {
        toast.error(err.response?.data?.message || "Admin dashboard load nahi ho pa raha hai.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <LoadingPanel />;

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Platform operations, revenue, bookings and verification queue"
    >
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard label="Users" value={data.totalUsers || 0} />
        <StatCard label="Hosts" value={data.totalHosts || 0} />
        <StatCard label="Cars" value={data.totalCars || 0} />
        <StatCard label="Bookings" value={data.totalBookings || 0} />
        <StatCard label="Completed Rides" value={data.totalCompletedRides || 0} />
        <StatCard label="Ongoing Rides" value={data.totalOngoingRides || 0} />
        <StatCard label="Platform Revenue" value={money(data.totalPlatformRevenue)} />
        <StatCard label="Commissions" value={money(data.totalCommissionsEarned)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-xl font-black mb-4">Monthly Revenue</h2>
          <div className="space-y-3">
            {(data.monthlyRevenueStats || []).slice(-6).map((item) => (
              <div key={`${item.year}-${item.month}`} className="flex justify-between border-b border-gray-100 pb-2">
                <span>{item.month}/{item.year}</span>
                <span className="font-bold">{money(item.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-xl font-black mb-4">Booking Growth</h2>
          <div className="space-y-3">
            {(data.bookingGrowthStats || []).slice(-6).map((item) => (
              <div key={`${item.year}-${item.month}`} className="flex justify-between border-b border-gray-100 pb-2">
                <span>{item.month}/{item.year}</span>
                <span className="font-bold">{item.bookings} bookings</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-black mb-4">Recent Bookings</h2>
          <AdminTable
            rows={data.recentBookings || []}
            columns={[
              { key: "car", label: "Car", render: (row) => row.car?.name || "-" },
              { key: "user", label: "User", render: (row) => row.user?.name || "-" },
              { key: "bookingStatus", label: "Booking" },
              { key: "rideStatus", label: "Ride" },
              { key: "totalAmount", label: "Amount", render: (row) => money(row.totalAmount || row.totalPrice) },
            ]}
            emptyMessage="No recent bookings."
          />
        </div>

        <div>
          <h2 className="text-xl font-black mb-4">Pending Verifications</h2>
          <AdminTable
            rows={data.pendingVerifications || []}
            columns={[
              { key: "name", label: "Host" },
              { key: "email", label: "Email" },
              { key: "verificationStatus", label: "Status" },
            ]}
            emptyMessage="No pending hosts."
          />
        </div>
      </div>
    </AdminLayout>
  );
}
