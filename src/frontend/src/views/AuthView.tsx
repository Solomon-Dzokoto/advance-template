import React, { useState } from "react";
import { authService } from "../services/auth";
import { Logo } from "../components";

interface AuthViewProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function AuthView({ onSuccess, onError }: AuthViewProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      onError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const authFn = isSignup ? authService.signup : authService.signin;
      await authFn(username, password);
      onSuccess();
    } catch (error) {
      onError(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Gradient background with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        {/* Animated shapes */}
        <div className="absolute inset-0">
          <div className="animate-blob absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-400 opacity-70 mix-blend-multiply blur-xl filter" />
          <div className="animate-blob animation-delay-2000 absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-yellow-400 opacity-70 mix-blend-multiply blur-xl filter" />
          <div className="animate-blob animation-delay-4000 absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-pink-400 opacity-70 mix-blend-multiply blur-xl filter" />
        </div>
      </div>

      {/* Auth content with glass effect */}
      <div className="z-10 w-full max-w-md transform px-4 transition-all">
        {/* Logo with animation */}
        <div className="mt-2 mb-8 flex transform justify-center transition-transform duration-300 hover:scale-105">
          <Logo className="rounded-2xl bg-white drop-shadow-2xl" />
        </div>

        <div className="hover:shadow-3xl transform space-y-6 rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-lg transition-all duration-300">
          {/* Title with animation */}
          <div className="transform space-y-2 transition-all duration-300">
            <h2 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-center text-3xl font-bold text-transparent">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-center text-sm text-gray-600">
              {isSignup
                ? "Sign up to start chatting with ChaKam"
                : "Sign in to continue your conversations"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input fields with animation */}
            <div className="transform space-y-4 transition-all duration-300">
              <div className="group">
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium text-gray-700 transition-colors group-hover:text-indigo-600"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-300 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                />
              </div>

              <div className="group">
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-gray-700 transition-colors group-hover:text-indigo-600"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-300 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit button with animation */}
            <button
              type="submit"
              disabled={loading}
              className="w-full transform rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white transition-all duration-300 hover:scale-[1.02] hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-t-2 border-white"></div>
                  <span className="animate-pulse">
                    {isSignup ? "Creating Account..." : "Signing In..."}
                  </span>
                </div>
              ) : isSignup ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider with animation */}
          <div className="relative transform py-3 transition-all duration-300">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500 transition-colors hover:text-indigo-600">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </span>
            </div>
          </div>

          {/* Toggle button with animation */}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="w-full transform rounded-lg border border-indigo-600 bg-transparent px-6 py-3 text-indigo-600 transition-all duration-300 hover:scale-[1.02] hover:bg-indigo-50 hover:shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
          >
            {isSignup ? "Sign In Instead" : "Create New Account"}
          </button>
        </div>

        {/* Footer text with hover effect */}
        <p className="mt-8 text-center text-sm text-white/90 transition-colors duration-300 hover:text-white">
          By using ChaKam, you agree to our{" "}
          <a href="#" className="underline hover:text-indigo-200">
            Terms of Service
          </a>
          {" and "}
          <a href="#" className="underline hover:text-indigo-200">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
