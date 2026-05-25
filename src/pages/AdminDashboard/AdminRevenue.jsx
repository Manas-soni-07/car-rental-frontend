import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/api";
import { AdminLayout, LoadingPanel, StatCard } from "./AdminLayout";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

export default function AdminRevenue() {
  const [revenue, setRevenue] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const [revenueRes, analyticsRes] = await Promise.all([
          API.get("/admin/revenue"),
          API.get("/admin/analytics"),
        ]);
        setRevenue(revenueRes.data?.data || {});
        setAnalytics(analyticsRes.data?.data || {});
      } catch (err) {
        toast.error(err.response?.data?.message || "Revenue analytics load nahi ho pa rahe hain.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  if (loading) return <LoadingPanel />;

  return (
    <AdminLayout title="Revenue Analytics" subtitle="Revenue, payouts, refunds and marketplace activity">
      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        <StatCard label="Total Revenue" value={money(revenue.totalRevenue)} />
        <StatCard label="Commissions" value={money(revenue.totalCommissions)} />
        <StatCard label="Host Payouts" value={money(revenue.hostPayouts)} />
        <StatCard label="Pending Payouts" value={money(revenue.pendingPayouts)} />
        <StatCard label="Refunded" value={money(revenue.refundedAmounts)} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Panel title="Most Booked Cities" items={analytics.mostBookedCities} labelKey="city" valueKey="bookings" />
        <Panel title="Most Booked Cars" items={analytics.mostBookedCars} labelKey="name" valueKey="bookings" />
        <Panel title="Top Hosts" items={analytics.topHosts} labelKey="name" valueKey="earnings" moneyValue />
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-8">
        <StatCard
          label="Conversion Rate"
          value={`${Number(analytics.bookingConversionStats?.conversionRate || 0).toFixed(1)}%`}
        />
        <StatCard
          label="Cancellation Rate"
          value={`${Number(analytics.cancellationRate || 0).toFixed(1)}%`}
        />
        <StatCard label="Active Users" value={analytics.activeUsers || 0} />
      </div>
    </AdminLayout>
  );
}

function Panel({ title, items = [], labelKey, valueKey, moneyValue }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="text-xl font-black mb-4">{title}</h2>
      <div className="space-y-3">
        {items.length ? (
          items.map((item, index) => (
            <div key={`${item[labelKey]}-${index}`} className="flex justify-between border-b border-gray-100 pb-2">
              <span>{item[labelKey] || "-"}</span>
              <span className="font-bold">
                {moneyValue ? money(item[valueKey]) : item[valueKey]}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No data yet.</p>
        )}
      </div>
    </div>
  );
}
