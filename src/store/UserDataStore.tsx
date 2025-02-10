import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
  id?: number;
  uuid?: string;
  mobileNumber?: string;
  type?: string;
  isTester?: boolean;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
}

export const UserData = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
