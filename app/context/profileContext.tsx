"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LoginContext } from "./loginContext";

type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  shipping_address: any;
  billing_address: any;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
} | null;

type ProfileContextType = {
  profile: UserProfile;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const auth = useContext(LoginContext);
  const [profile, setProfile] = useState<UserProfile>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Error fetching profile on client:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [auth?.user]);

  return (
    <ProfileContext.Provider value={{ profile, loading, refreshProfile: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}