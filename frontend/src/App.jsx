import React from "react";
import { Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signUpPage";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { authUser, isLoggedIn, login } = useAuthStore();
  console.log("Auth User is: ", authUser);
  console.log("Login Status: ", isLoggedIn);
  return (
    <div className="min-h-screen bg-[#ff4c68] relative flex items-center justify-center p-4 overflow-hidden">
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-[#ef8172] opacity-50 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96  bg-[#00bfff] opacity-10 blur-[100px]" />

      <button onClick={login} className="z-10">
        Login
      </button>

      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default App;
