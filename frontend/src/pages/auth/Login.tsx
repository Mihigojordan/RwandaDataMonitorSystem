import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Users, Building2, BarChart3, Database } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useAdminAuth from "../../context/AdminAuthContext";
import Logo from '../../assets/logo.png'

// Define interfaces and types
interface FormData {
  email: string;
  password: string;
  otp: string;
}

interface Errors {
  email?: string;
  password?: string;
  otp?: string;
  general?: string;
}

interface Touched {
  email?: boolean;
  password?: boolean;
  otp?: boolean;
}

interface LoginResponse {
  authenticated: boolean;
  message?: string;
  twoFARequired?: boolean;
  adminId?: string;
}

interface OTPVerifyResponse {
  authenticated: boolean;
  message?: string;
}

interface AdminAuthContext {
  login: (credentials: { adminEmail: string; password: string }) => Promise<LoginResponse>;
  verifyOTP: (data: { adminId: string; otp: string }) => Promise<OTPVerifyResponse>;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOTPRequired: boolean;
  pendingAdminId: string | null;
}

const AdminLogin: React.FC = () => {
  const { login, verifyOTP, isLoading: authLoading, isAuthenticated, isOTPRequired, pendingAdminId,handleSetIsOTPRequired } = useAdminAuth() ;

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    otp: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from);
    }
  }, [isAuthenticated, authLoading, location, navigate]);

  // Real-time validation functions
  const validateEmail = (email: string): string => {
    if (!email) {
      return "Email is required";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const validateOTP = (otp: string): string => {
    if (!otp) {
      return "OTP is required";
    }
    if (!/^\d{6}$/.test(otp)) {
      return "OTP must be a 6-digit number";
    }
    return "";
  };

  // Validate field on change
  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      case "otp":
        return validateOTP(value);
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field in real-time if it has been touched
    if (touched[name as keyof Touched] || value !== "") {
      const error = validateField(name as keyof FormData, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Mark field as touched on blur
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field
    const error = validateField(name as keyof FormData, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};

    if (!isOTPRequired) {
      newErrors.email = validateEmail(formData.email);
      newErrors.password = validatePassword(formData.password);
    } else {
      newErrors.otp = validateOTP(formData.otp);
    }

    // Filter out empty errors
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key as keyof Errors]) {
        delete newErrors[key as keyof Errors];
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all relevant fields as touched
    setTouched({
      email: !isOTPRequired ? true : touched.email,
      password: !isOTPRequired ? true : touched.password,
      otp: isOTPRequired ? true : touched.otp,
    });

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (!isOTPRequired) {
        // Initial login with email and password
        const response = await login({
          identifier: formData.email,
          password: formData.password,
        });

        if (response.authenticated) {
          // Redirect to intended page or dashboard
          const from = location.state?.from?.pathname || "/admin/dashboard";
          navigate(from);
        } else if (response.twoFARequired) {
          // OTP required; form will switch to OTP input due to isOTPRequired
        } else {
          setErrors({ general: response.message || "Login failed" });
        }
      } else {
        // OTP verification
        if (!pendingAdminId) {
          setErrors({ general: "No pending login session found" });
          setIsLoading(false);
          return;
        }

        const response = await verifyOTP({
          adminId: pendingAdminId,
          otp: formData.otp,
        });

        if (response.authenticated) {
          // Redirect to intended page or dashboard
          const from = location.state?.from?.pathname || "/admin/dashboard";
          navigate(from);
          
        } else {
          setErrors({ general: response.message || "Invalid OTP" });
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrors({
        general: error.message || "An error occurred during login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    handleSetIsOTPRequired({otpRequired:false})
    setFormData((prev) => ({ ...prev, otp: "" }));
    setErrors({});
    setTouched((prev) => ({ ...prev, otp: false }));
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    if (!isOTPRequired) {
      return !!formData.email && !!formData.password && !errors.email && !errors.password;
    } else {
      return !!formData.otp && !errors.otp;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-300 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-primary-200 rounded-full opacity-30 blur-lg"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-primary-300 rounded-full opacity-15 blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-primary-200 rounded-full opacity-25 blur-lg"></div>
      </div>

      {/* Left side - Brand and illustration */}
      <div
        className="w-5/12 flex items-center justify-center p-8 relative z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")`,
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/75 to-primary-500/85"></div>
<div className="max-w-lg text-white relative z-10">
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
    <h1 className="text-4xl font-bold mb-6 text-white">
      Empowering Rwanda through reliable statistics and data-driven insights.
    </h1>

    {/* Infographic-style icon representation */}
    <div className="mb-6 flex justify-center">
      <div className="relative">
        <div className="flex items-center space-x-4 p-6">
          {/* Data icon */}
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          {/* Analytics icon */}
          <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <Database className="w-6 h-6 text-white" />
          </div>
          {/* People & development icon */}
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <Users className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Animated decorative bubbles */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-300/80 rounded-full animate-pulse"></div>
        <div
          className="absolute -bottom-2 -left-6 w-4 h-4 bg-indigo-200/70 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </div>

    <p className="text-blue-100 text-lg leading-relaxed">
      Delivering accurate, timely, and relevant statistics to inform policy,
      planning, and sustainable development across Rwanda.
    </p>
  </div>
</div>

      </div>

      {/* Right side - Login or OTP form */}
      <div className="w-7/12 bg-white flex flex-col justify-center p-8 relative z-10">
        <div className="w-full max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
            <img src={Logo} alt="" className="w-72" />
            </div>

          
          </div>

          {/* Error message */}
          {errors.general && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Login or OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isOTPRequired ? (
              <>
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                      errors.email
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-300 focus:border-primary-500 focus:ring-primary-500/20"
                    } focus:outline-none focus:ring-4`}
                    placeholder="Enter your email"
                    disabled={isLoading || authLoading}
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 pr-12 rounded-lg border transition-colors duration-200 ${
                        errors.password
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 focus:border-primary-500 focus:ring-primary-500/20"
                      } focus:outline-none focus:ring-4`}
                      placeholder="Enter your password"
                      disabled={isLoading || authLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      disabled={isLoading || authLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    onClick={() => console.log('Forgot password clicked')}
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* OTP Field */}
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    OTP Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                      errors.otp
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-300 focus:border-primary-500 focus:ring-primary-500/20"
                    } focus:outline-none focus:ring-4`}
                    placeholder="Enter 6-digit OTP"
                    disabled={isLoading || authLoading}
                    maxLength={6}
                  />
                  {errors.otp && touched.otp && (
                    <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
                  )}
                </div>

                {/* Back to Login Link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    disabled={isLoading || authLoading}
                  >
                    Back to Login
                  </button>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || authLoading || !isFormValid()}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading || authLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isOTPRequired ? "Verifying OTP..." : "Signing in..."}
                </div>
              ) : isOTPRequired ? (
                "Verify OTP"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500">
              Copyright © 2025 - NISR 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;