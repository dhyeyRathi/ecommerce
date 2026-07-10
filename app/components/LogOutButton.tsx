"use client";
import React, { useContext } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import { LoginContext } from "../context/loginContext";


export function useSignOut() {
  const auth = useContext(LoginContext);
  const router = useRouter();
  const handleSignOut = async (e?: React.MouseEvent) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      auth?.setUser(false)
      router.push("/login");
    }
  };
  return handleSignOut;
}

export default function LogoutButton() {
  const handleSignOut = useSignOut();
  
  return (
    <button 
      onClick={handleSignOut}
      className="flex items-center gap-2 border-2 border-border hover:border-primary/50 text-heading hover:bg-background/50 font-bold text-sm md:text-base px-6 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-log-out"
      >
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      </svg>
      Log Out
    </button>
  );
}