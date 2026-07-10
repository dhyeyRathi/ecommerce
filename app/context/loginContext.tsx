"use client";

import { createContext, useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type LoginContextType = {
  user: boolean;
  setUser: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoginContext = createContext<LoginContextType | null>(null);

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(!!session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(!!session);
      if (session) {
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
        document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
      } else {
        document.cookie =
          "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure";
        document.cookie =
          "sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure";
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <LoginContext.Provider value={{ user, setUser }}>
      {children}
    </LoginContext.Provider>
  );
}

