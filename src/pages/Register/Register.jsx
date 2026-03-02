import { useState } from "react";
import API from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, UserCircle, ShieldCheck, ArrowRight, Car } from "lucide-react";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      toast("Account created successfully!")
      navigate("/login");
    } catch (err) {
   toast.error(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-80 bg-black z-0"></div>
      
      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8 text-white">
          <div className="inline-flex bg-blue-600 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <Car size={32} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Create Your Account</h2>
          <p className="text-gray-400 mt-2">Join thousands of drivers worldwide</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Role Selection Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setForm({...form, role: 'user'})}
                className={`flex-1 flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                  form.role === 'user' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <UserCircle className={form.role === 'user' ? 'text-blue-600' : 'text-gray-400'} />
                <span className={`text-xs font-bold mt-1 ${form.role === 'user' ? 'text-blue-600' : 'text-gray-500'}`}>Renter</span>
              </button>
              <button
                type="button"
                onClick={() => setForm({...form, role: 'host'})}
                className={`flex-1 flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                  form.role === 'host' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <ShieldCheck className={form.role === 'host' ? 'text-blue-600' : 'text-gray-400'} />
                <span className={`text-xs font-bold mt-1 ${form.role === 'host' ? 'text-blue-600' : 'text-gray-500'}`}>Host</span>
              </button>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  name="name"
                  placeholder="John Doe"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  name="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all transform active:scale-[0.98] disabled:opacity-70 mt-4 shadow-lg shadow-blue-600/20"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-8 text-center border-t pt-6">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}