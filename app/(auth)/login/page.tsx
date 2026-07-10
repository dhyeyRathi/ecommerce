"use client";
import { LoginContext } from "@/app/context/loginContext";
import { redirect, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import React, { useContext, useState } from "react";
import Link from "next/link";

const page = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [wrongPwd, setWrongPwd] = useState<boolean>(false);

  const auth = useContext(LoginContext);
  const router = useRouter();

  async function handleLogin(e: React.SyntheticEvent) {
    e.preventDefault();
    setWrongPwd(false);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      setWrongPwd(true);
    } else {

      router.push("/");

    }
  }

  return (
    <div className="h-full w-full bg-background flex justify-center items-center">
      <div
        aria-label="login container"
        className={`flex flex-col border-2 border-border shadow-[0_0_4px] gap-4  shadow-border py-8  px-8 md:px-4 rounded-2xl bg-surface ${wrongPwd && "shadow-red-800"}`}
      >
        <div aria-label="headings" className="flex w-full p-2 flex-col gap-4 justify-center items-center">
          <h1 className="text-5xl md:text-6xl font-bold text-heading italic w-full text-center ">
            {" "}
            EZ<span className="text-primary not-italic">Mart</span>
          </h1>
          <h1 className="text-2xl md:text-4xl font-bold text-heading w-full text-center ">
            Login
          </h1>
        </div>
        <form aria-label="input container" className="flex flex-col w-full gap-6 lg:gap-10 lg:p-6 justify-center items-center" onSubmit={handleLogin}>
          <div className="flex flex-col md:flex-row w-full md:gap-4 md:w-2/3 md:items-center  text-heading">
            <label className="md:text-center md:w-30" htmlFor="email input" >
              E-mail:
            </label>
            <input type="email" id="email input" value={email} onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-2 border-border focus:shadow-xs shadow-text inset-shadow-[0_0_4px] w-75 md:w-120  inset-shadow-border 
                 p-2 rounded-lg focus:outline-none"
              placeholder="Enter your email..." required />
          </div>

          <div className="flex flex-col md:flex-row md:gap-4 w-full md:w-2/3  md:items-center relative  text-heading">
            <label className="md:text-center md:w-30" htmlFor="password input" >
              Password:
            </label>
            <input type="password" id="password input" value={password} onChange={(e) => setPassword(e.target.value)}
              className="bg-background border-2 border-border focus:shadow-xs shadow-text inset-shadow-[0_0_4px] w-75 md:w-120  inset-shadow-border 
               p-2  rounded-lg focus:outline-none"
              placeholder="Enter your password..." required />
            {wrongPwd && <p className="absolute text-red-600 text-sm md:text-base bottom-[-25] lg:bottom-[-30] right-9">Check your credentials and try again!</p>}
          </div>

          <div className="flex flex-col md:flex-row md:gap-4 w-full md:w-2/3  justify-center md:items-center  text-heading">
            <button className="bg-primary text-background px-6 py-2 w-full rounded-lg hover:bg-primary-hover text-lg mt-3 lg:mt-0 sm:text-2xl" type="submit"
            >
              Log In
            </button>
          </div>

          <div className="text-center text-sm text-text-muted mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" prefetch={false} className="text-primary hover:underline font-semibold">
              Sign Up
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default page;
