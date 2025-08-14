// src/Components/Login.jsx

import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase-config.js";

const Login = ({ onSignIn, onGoogleSignIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onSignIn();
    } catch (err) {
      console.log("Firebase Auth Error:", err);
      switch (err.code) {
        case "auth/email-already-in-use":
          setError(
            "This email address is already in use. Please sign in or use a different email."
          );
          break;
        case "auth/invalid-email":
          setError("The email address is not valid.");
          break;
        case "auth/invalid-credential":
          setError(
            "No account found with this email or incorrect password. Please sign up or try again."
          );
          break;
        case "auth/weak-password":
          setError("Password must be at least 6 characters long.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your internet connection.");
          break;
        default:
          setError("An unknown error occurred. Please try again.");
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setError("");
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/calendar.readonly");

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // Pass the Google access token to the parent component
      onGoogleSignIn(credential.accessToken);
    } catch (err) {
      console.log("Google Sign-in Error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Failed to sign in with Google. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  return (
    <section className="h-full flex items-center justify-center">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src="/logo.png"
            alt="Your Company"
            className="mx-auto h-50 w-auto"
          />
          <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                {isLogin && (
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {isLoading ? "Loading..." : isLogin ? "Sign in" : "Sign up"}
              </button>
            </div>
          </form>

          {/* Social Sign-in Section */}
          <div className="mt-4">
            <div className="divider">OR</div>

            <button
              onClick={signInWithGoogle}
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              <img
                src="/icons/google-brands-solid-full.svg"
                className="w-5 mr-4"
              />
              Sign in with Google
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            {isLogin ? "Not a member?" : "Already have an account?"}
            <button
              onClick={toggleAuthMode}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1"
            >
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
