import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: { name: "John", _id: 123, age: 23 },
  isLoggedIn: false,

  login: () => {
    console.log("Just Logged In");
    set({ isLoggedIn: true });
  },
}));
