"use client";

import { createContext, useState } from "react";

type LoginContextType = {
  user: boolean ;
  setUser: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoginContext = createContext<LoginContextType | null>(null);

export function LoginProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<boolean>(false);

  return (
    <LoginContext.Provider value={{ user, setUser }}>
      {children}
    </LoginContext.Provider>
  );
}