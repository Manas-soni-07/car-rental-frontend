import { Link, NavLink } from "react-router-dom";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/hosts", label: "Hosts" },
  { to: "/admin/cars", label: "Cars" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/revenue", label: "Revenue" },
];

export function AdminLayout({ title, subtitle, children }) {
  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-bold border ${
                    isActive
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-100 hover:text-blue-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

export function StatCard({ label, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <p className="text-xs text-gray-400 font-bold uppercase">{label}</p>
      <p className="text-2xl font-black text-gray-900 mt-2">{value}</p>
    </div>
  );
}

export function LoadingPanel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-blue-600" />
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500">
      {message}
    </div>
  );
}

export function AdminTable({ columns, rows, emptyMessage }) {
  if (!rows?.length) return <EmptyState message={emptyMessage || "No records found."} />;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="text-left px-5 py-4 font-bold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row._id || row.id}>
              {columns.map((column) => (
                <td key={column.key} className="px-5 py-4 text-gray-700">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PageLink({ to, children }) {
  return (
    <Link to={to} className="text-blue-600 font-bold hover:underline">
      {children}
    </Link>
  );
}
