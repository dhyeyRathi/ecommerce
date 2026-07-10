"use client";
import React, { useContext, useState } from "react";
import { LoginContext } from "@/app/context/loginContext";
import { redirect, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function SignUpPage() {
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [matchPwd, setMatchPwd] = useState<boolean>(false);
  const auth = useContext(LoginContext);
  const router = useRouter();

  const handleSignup = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (password !== rePassword) {
      setMatchPwd(true);
      setPassword("");
      setRePassword("");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName, 
          last_name: lastName, 
          role: "customer",
        },
      },
    });
    if (error) {
      alert(error.message);
    } else {
      alert(
        "Sign up successful! Please check your email for verification (if enabled) or log in.",
      );
      router.push("/login");
    }
  };
  return (
    <div className="h-full w-full bg-background flex justify-center items-center">
      <div
        aria-label="login container"
        className={`flex flex-col border-2 border-border shadow-[0_0_4px] gap-4  shadow-border py-8  px-8 md:px-4 rounded-2xl bg-white ${matchPwd && "shadow-red-800"}`}
      >
        <div
          aria-label="headings"
          className="flex w-full p-2 flex-col gap-4 justify-center items-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-heading italic w-full text-center ">
            {" "}
            EZ<span className="text-primary not-italic">Mart</span>
          </h1>
          <h1 className="text-2xl md:text-4xl font-bold text-heading w-full text-center ">
            Sign Up
          </h1>
        </div>
        <form onSubmit={handleSignup}
          aria-label="input container"
          className="flex flex-col w-full gap-6 lg:gap-10 lg:p-6 justify-center items-center"
        >
          <div className="flex flex-col md:flex-row w-full md:gap-4 md:w-2/3 md:items-center  text-heading">
            <label
              className="md:text-center md:w-40"
              htmlFor="first name input"
            >
              First Name:
            </label>
            <input
              type="text"
              id="first name input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-background border-2 border-border focus:shadow-xs shadow-text inset-shadow-[0_0_4px] w-75 md:w-140  inset-shadow-border 
                 p-2 rounded-lg focus:outline-none"
              placeholder="Enter a Username..."
              required
            />
          </div>

          <div className="flex flex-col md:flex-row w-full md:gap-4 md:w-2/3 md:items-center  text-heading">
            <label className="md:text-center md:w-40" htmlFor="last name input">
              Last Name:
            </label>
            <input
              type="text"
              id="last name input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-background border-2 border-border focus:shadow-xs shadow-text inset-shadow-[0_0_4px] w-75 md:w-140  inset-shadow-border 
                 p-2 rounded-lg focus:outline-none"
              placeholder="Enter a Username..."
              required
            />
          </div>

          <div className="flex flex-col md:flex-row w-full md:gap-4 md:w-2/3 md:items-center  text-heading">
            <label className="md:text-center md:w-40" htmlFor="email input">
              E-mail:
            </label>
            <input
              type="email"
              id="email input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-2 border-border focus:shadow-xs shadow-text inset-shadow-[0_0_4px] w-75 md:w-140  inset-shadow-border 
                 p-2 rounded-lg focus:outline-none"
              placeholder="Enter your email..."
              required
            />
          </div>

          <div className="flex flex-col md:flex-row md:gap-4 w-full md:w-2/3  md:items-center relative  text-heading">
            <label className="md:text-center md:w-40" htmlFor="password input">
              Password:
            </label>
            <input
              type="password"
              value={password}
              id="password input"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border-2 border-border focus:shadow-xs shadow-text inset-shadow-[0_0_4px] w-75 md:w-140  inset-shadow-border 
               p-2  rounded-lg focus:outline-none"
              placeholder="Enter your password..."
              required
            />
          </div>

          <div className="flex flex-col md:flex-row md:gap-4 w-full md:w-2/3  md:items-center relative  text-heading">
            <label
              className="md:text-center md:w-40"
              htmlFor="re-password input"
            >
              Re type Password:
            </label>
            <input
              type="password"
              value={rePassword}
              id="re-password input"
              onChange={(e) => setRePassword(e.target.value)}
              className="bg-background border-2 border-border focus:shadow-xs shadow-text inset-shadow-[0_0_4px] w-75 md:w-140  inset-shadow-border 
               p-2  rounded-lg focus:outline-none"
              placeholder="Re-enter your password..."
              required
            />
            {matchPwd && (
              <p className="absolute text-red-600 text-sm md:text-base bottom-[-25] lg:bottom-[-30] right-32">
                Passwords do not match!
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:gap-4 w-full md:w-2/3  justify-center md:items-center  text-heading">
            <button
              className="bg-primary text-background px-6 py-2 w-full rounded-lg hover:bg-primary-hover text-lg mt-3 lg:mt-0 sm:text-2xl"
              type="submit"
              
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
