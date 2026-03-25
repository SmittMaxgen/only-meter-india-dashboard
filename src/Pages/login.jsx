import { useEffect, useState } from "react";
import { useAppContext } from "../Central_Store/app_context.jsx";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import img from "../assets/login_page.png"
import Logo from "../assets/Logo.png"

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { baseUrl } = useAppContext();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    //Validation
    if (!email || !password) {
      setError("Both email and password are required");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length <= 5) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setIsLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch(`${baseUrl}/admin_login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      const validData = data.data;


      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Handle successful login (e.g., redirect, store token, etc.)

      if (validData.email === email && validData.password) {
        localStorage.setItem("isAuth", "true");
        navigate("/dashboard/home");
        setEmail("");
        setPassword("");
      } else {
        if(validData.email === email){
          setError("Not a valid email");
        }else {
          setError("Not a valid password");
        }
      }
    } catch (err) {
      setError("Invalid email or password");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(localStorage.getItem("isAuth")) {
      navigate("/dashboard/home");
    }
  })

  if (localStorage.getItem("isAuth")) {
  return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Section - Your Image */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <img 
          src={img}
          alt="My Taxi City Illustration" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Right Section - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center">
            <img src={Logo} alt="My Taxi Logo" className="h-52 w-auto" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Unlock Your Admin Dashboard</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                placeholder="Enter your email"
              />
            </div>
            
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Login Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors ${
                  isLoading ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
