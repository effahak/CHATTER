import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000/" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error Checking Authentication", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);

      if (res.status === 204) {
        toast.success("Account created successfully (no content).");
      } else {
        set({ authUser: res.data });
        toast.success("Account Created Successfully!");
      }
      get().connectSocket();
    } catch (error) {
      console.error("Error Signing Up:", error);

      const message =
        error?.response?.data?.message ||
        "Sign-up failed. Please check your details and try again.";

      toast.error(message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);

      if (res.status === 204) {
        toast.success("Logged in successfully (no content).");
      } else {
        set({ authUser: res.data });
        toast.success("Logged In Successfully!");
        get().connectSocket();
      }
    } catch (error) {
      console.error("Error Logging In:", error);
      const message =
        error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out Successfully!");
      get().disconnectSocket();
    } catch (error) {
      console.error("Error Logging Out:", error);
      const message =
        error?.response?.data?.message || "Logout failed. Please try again.";
      toast.error(message);
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Picture Updated Successfully!");
    } catch (error) {
      console.log("Error in profile update: ", error);
      const message =
        error?.response?.data?.message ||
        "Profile Update failed. Please try again.";
      toast.error(message);
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
      transports: ["websocket"], // ensures cookies are sent with the connection
    });
    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
