import { useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Car } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
      window.location.reload(); 
    } catch (err) {
      toast.error(err.response?.data?.msg || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
   
      <div className="absolute top-0 left-0 w-full h-64 bg-black z-0"></div>
      
      <div className="relative z-10 w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex bg-blue-600 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <Car className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Login to manage your rides</p>
        </div>


        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
 
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

   
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" />
                Remember me
              </label>
              <Link to="/forgot-password" size={18} className="text-blue-600 font-medium hover:underline">
                Forgot password?
              </Link>
            </div>

 
            <button
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all transform active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Authenticating..." : "Sign In"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

      
          <div className="mt-8 text-center border-t pt-6">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}